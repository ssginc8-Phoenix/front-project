// src/features/calendar/pages/PatientCalendar.tsx
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getPatientCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

interface CalendarItem {
  date: string;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  times?: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
  time?: string;
  relatedId?: number;
  patientName?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background-color: #f5f7fa; /* Ensure background color consistency */

  ${media.tablet} {
    padding: 1.5rem;
  }

  ${media.mobile} {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  ${media.mobileSmall} {
    padding: 0.8rem 0.5rem;
    gap: 0.8rem;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.5rem;
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .appointment-dot {
    background: #1a5da2;
  }
  .medication-dot {
    background: #267e3e;
  }

  ${media.mobile} {
    font-size: 0.8rem;
    gap: 1rem;
    .dot {
      width: 10px;
      height: 10px;
    }
  }

  ${media.mobileSmall} {
    font-size: 0.75rem;
    gap: 0.8rem;
  }
`;

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border: none;
  }
  .react-calendar__tile {
    border-radius: 12px;
    padding: 0.75rem 0.5rem;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: background 0.2s ease;
  }
  .react-calendar__tile--now {
    background: #e3f2fd;
    font-weight: bold;
  }
  .react-calendar__tile--active {
    background: #90caf9 !important;
    color: white;
  }
  .calendar-day-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .calendar-event {
    font-size: 0.7rem;
    padding: 3px 6px;
    margin-top: 2px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    word-break: keep-all;
    cursor: pointer;
  }
  .medication {
    background-color: #e6fbe5;
    color: #267e3e;
  }
  .appointment {
    background-color: #e0f0ff;
    color: #1a5da2;
  }
  .react-calendar__month-view__days__day:nth-child(7n) {
    color: black !important;
  }

  /* React Calendar Specific Adjustments for responsiveness */
  .react-calendar__navigation button {
    font-size: 1rem;
  }

  .react-calendar__month-view__weekdays__weekday {
    font-size: 0.9rem;
  }

  .react-calendar__tile abbr {
    font-size: 1rem;
  }

  ${media.tablet} {
    .react-calendar {
      padding: 0.8rem;
    }
    .react-calendar__tile {
      min-height: 80px;
      padding: 0.6rem 0.4rem;
    }
    .calendar-event {
      font-size: 0.65rem;
      padding: 2px 5px;
    }
    .react-calendar__navigation button {
      font-size: 0.9rem;
    }
    .react-calendar__month-view__weekdays__weekday {
      font-size: 0.8rem;
    }
    .react-calendar__tile abbr {
      font-size: 0.9rem;
    }
  }

  ${media.mobile} {
    .react-calendar {
      padding: 0.6rem;
    }
    .react-calendar__tile {
      min-height: 60px;
      padding: 0.5rem 0.3rem;
    }
    .calendar-event {
      font-size: 0.6rem;
      padding: 2px 4px;
      margin-top: 1px;
    }
    .react-calendar__navigation button {
      font-size: 0.8rem;
    }
    .react-calendar__month-view__weekdays__weekday {
      font-size: 0.7rem;
    }
    .react-calendar__tile abbr {
      font-size: 0.8rem;
    }
  }

  ${media.mobileSmall} {
    .react-calendar {
      padding: 0.4rem;
    }
    .react-calendar__tile {
      min-height: 50px;
      padding: 0.4rem 0.2rem;
    }
    .calendar-event {
      font-size: 0.55rem;
      padding: 1px 3px;
    }
    .react-calendar__navigation button {
      font-size: 0.7rem;
    }
    .react-calendar__month-view__weekdays__weekday {
      font-size: 0.65rem;
    }
    .react-calendar__tile abbr {
      font-size: 0.75rem;
    }
    .calendar-day-wrapper > div:last-child {
      font-size: 0.6rem !important; /* Adjust "see more" text size */
    }
  }
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  ${media.mobile} {
    font-size: 0.9rem;
  }

  ${media.mobileSmall} {
    font-size: 0.85rem;
  }
`;

const StyledItem = styled.li<{ itemType: 'MEDICATION' | 'APPOINTMENT' }>`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  padding: 1rem 1.25rem;
  margin-bottom: 0.7rem;
  border-radius: 14px;
  background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#f4fcf7' : '#f6f9fe')};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    border-radius: 14px 0 0 14px;
    background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#34c759' : '#2563eb')};
  }

  cursor: pointer;
  transition: transform 0.12s ease;
  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#d1fadf' : '#dbe8ff')};
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    .title {
      font:
        600 1rem/1.25 'Pretendard',
        sans-serif;
      color: ${({ itemType }) => (itemType === 'MEDICATION' ? '#15803d' : '#1e3a8a')};
    }
    .desc {
      font:
        500 0.82rem/1.3 'Pretendard',
        sans-serif;
      color: #64748b;
    }
  }

  .time {
    font:
      600 0.9rem/1 'Pretendard',
      sans-serif;
    color: #475569;
    white-space: nowrap;
  }

  ${media.mobile} {
    padding: 0.8rem 1rem;
    margin-bottom: 0.6rem;
    grid-template-columns: 36px 1fr auto; /* Adjust grid columns for mobile */
    &::before {
      width: 4px; /* Thinner border for mobile */
    }
    .icon {
      width: 36px;
      height: 36px;
      font-size: 1.1rem;
    }
    .info {
      .title {
        font-size: 0.9rem;
      }
      .desc {
        font-size: 0.75rem;
      }
    }
    .time {
      font-size: 0.8rem;
    }
  }

  ${media.mobileSmall} {
    padding: 0.7rem 0.8rem;
    margin-bottom: 0.5rem;
    grid-template-columns: 32px 1fr auto; /* Adjust grid columns for small mobile */
    &::before {
      width: 3px; /* Even thinner border */
    }
    .icon {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
    .info {
      .title {
        font-size: 0.85rem;
      }
      .desc {
        font-size: 0.7rem;
      }
    }
    .time {
      font-size: 0.75rem;
    }
  }
`;

const DetailContainer = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  position: relative;
  max-width: 500px;
  margin: 0 auto;

  ${media.tablet} {
    padding: 1.5rem;
    gap: 1.2rem;
  }

  ${media.mobile} {
    padding: 1.2rem;
    gap: 1rem;
    max-width: 95%;
  }

  ${media.mobileSmall} {
    padding: 1rem;
    gap: 0.8rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${media.mobile} {
    gap: 0.5rem;
  }
`;

const HeaderIcon = styled.div`
  font-size: 2rem;
  background: #e0f2fe;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;

  ${media.mobile} {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  ${media.mobileSmall} {
    font-size: 1.2rem;
    width: 36px;
    height: 36px;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;

  ${media.mobile} {
    font-size: 1.1rem;
  }

  ${media.mobileSmall} {
    font-size: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 1rem;
  column-gap: 1rem;

  ${media.tablet} {
    grid-template-columns: 100px 1fr;
    column-gap: 0.8rem;
  }

  ${media.mobile} {
    grid-template-columns: 80px 1fr;
    row-gap: 0.8rem;
    column-gap: 0.6rem;
  }

  ${media.mobileSmall} {
    grid-template-columns: 70px 1fr;
    row-gap: 0.7rem;
  }
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  text-align: center; /* Align right for consistency with other details */

  ${media.mobile} {
    font-size: 0.85rem;
  }

  ${media.mobileSmall} {
    font-size: 0.8rem;
  }
`;

const Value = styled.div`
  font-size: 1rem;
  color: #0f172a;
  text-align: left; /* Ensure value text aligns left */

  ${media.mobile} {
    font-size: 0.95rem;
  }

  ${media.mobileSmall} {
    font-size: 0.9rem;
  }
`;

const mealLabel = (meal: string) => {
  const map: Record<string, string> = {
    morning: '아침',
    lunch: '점심',
    dinner: '저녁',
  };
  return map[meal] ?? meal;
};

export default function PatientCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, CalendarItem[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<CalendarItem[]>([]);
  const [modalDate, setModalDate] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection

  const groupByDate = (items: CalendarItem[]) =>
    items.reduce(
      (acc, it) => {
        acc[it.date] = acc[it.date] || [];
        acc[it.date].push(it);
        return acc;
      },
      {} as Record<string, CalendarItem[]>,
    );

  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;
    (async () => {
      try {
        const res = await getPatientCalendar(year, month);
        const raw: CalendarItem[] = res.calendarItems || [];
        setCalendarData(groupByDate(raw));
      } catch (e) {
        console.error('캘린더 로딩 실패', e);
      }
    })();
  }, [activeDate]);

  // Effect to update isMobile state on resize
  useEffect(() => {
    const checkMobile = () => {
      // Use the actual 'mobile' breakpoint value from `sizes`
      setIsMobile(window.innerWidth <= parseInt(sizes.mobile, 10));
    };

    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile); // Add resize listener

    return () => window.removeEventListener('resize', checkMobile); // Cleanup
  }, []);

  const openDetail = async (item: CalendarItem) => {
    if (item.itemType === 'MEDICATION' && item.relatedId) {
      try {
        const detail = await getMedicationSchedule(item.relatedId);
        setSelectedItem({
          ...item,
          title: detail.medicationName,
          startDate: detail.startDate,
          endDate: detail.endDate,
          times: detail.times,
          patientName: detail.patientName,
        });
      } catch {
        alert('상세 정보를 불러오는 데 실패했습니다.');
        return;
      }
    } else {
      setSelectedItem(item);
    }
    setItemDetailOpen(true);
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const key = kst.toISOString().split('T')[0];
    const items = calendarData[key] || [];
    if (!items.length) return null;

    return (
      <div
        className="calendar-day-wrapper"
        onClick={(e) => {
          e.stopPropagation();
          setModalItems(items);
          setModalDate(key);
          setModalOpen(true);
        }}
      >
        {items.slice(0, 3).map((it, i) => (
          <div
            key={i}
            className={`calendar-event ${it.itemType === 'MEDICATION' ? 'medication' : 'appointment'}`}
          >
            {isMobile ? ( // Conditional rendering based on isMobile state
              it.itemType === 'MEDICATION' ? (
                <>복약</>
              ) : (
                <>진료</>
              )
            ) : it.itemType === 'MEDICATION' ? (
              <>💊 {it.title}</>
            ) : (
              <>🏥 {it.title}</>
            )}
          </div>
        ))}
        {items.length > 3 && (
          <div style={{ fontSize: '.7rem', color: '#888' }}>+{items.length - 3}개 더보기</div>
        )}
      </div>
    );
  };

  return (
    <>
      <Wrapper>
        <Legend>
          <div className="legend-item">
            <div className="dot appointment-dot" /> 일반진료
          </div>
          <div className="legend-item">
            <div className="dot medication-dot" />약 복용
          </div>
        </Legend>
        <CalendarWrapper>
          <Calendar
            locale="en-US"
            value={selectedDate}
            onChange={(d) => d instanceof Date && setSelectedDate(d)}
            tileContent={renderTileContent}
            onActiveStartDateChange={({ activeStartDate }) =>
              activeStartDate && setActiveDate(activeStartDate)
            }
          />
        </CalendarWrapper>
      </Wrapper>

      {modalOpen && (
        <CommonModal
          title={`${modalDate} 일정 전체보기`}
          buttonText="닫기"
          onClose={() => setModalOpen(false)}
        >
          <StyledList>
            {modalItems.map((it, i) => (
              <StyledItem
                key={i}
                itemType={it.itemType}
                onClick={() => {
                  openDetail(it);
                  setModalOpen(false);
                }}
              >
                <div className="icon">{it.itemType === 'MEDICATION' ? '💊' : '🏥'}</div>
                <div className="info">
                  <div className="title">{it.title}</div>
                  {it.description && <div className="desc">{it.description}</div>}
                </div>
              </StyledItem>
            ))}
          </StyledList>
        </CommonModal>
      )}

      {itemDetailOpen && selectedItem && (
        <CommonModal title={null} buttonText="확인" onClose={() => setItemDetailOpen(false)}>
          <DetailContainer>
            <HeaderSection>
              <HeaderIcon>{selectedItem.itemType === 'MEDICATION' ? '💊' : '🏥'}</HeaderIcon>
              <HeaderTitle>{selectedItem.date} 상세 정보</HeaderTitle>
            </HeaderSection>

            <InfoGrid>
              {selectedItem.itemType === 'MEDICATION' ? (
                <>
                  <Label>복약명</Label>
                  <Value>{selectedItem.title}</Value>

                  <Label>복약 기간</Label>
                  <Value>
                    {selectedItem.startDate} ~ {selectedItem.endDate}
                  </Value>

                  <Label>복용 시간</Label>
                  <Value>
                    {selectedItem.times && selectedItem.times.length > 0
                      ? selectedItem.times
                          .map(
                            (t: { meal: string; time: string }) =>
                              `${mealLabel(t.meal)} ${t.time.slice(0, 5)}`,
                          )
                          .join('\n')
                      : '시간 정보 없음'}
                  </Value>
                </>
              ) : (
                <>
                  <Label>진료명</Label>
                  <Value>{selectedItem.title}</Value>

                  <Label>진료일</Label>
                  <Value>{selectedItem.date}</Value>

                  <Label>시간</Label>
                  <Value>{selectedItem.time}</Value>
                </>
              )}
            </InfoGrid>
          </DetailContainer>
        </CommonModal>
      )}
    </>
  );
}
