// src/features/calendar/pages/PatientCalendar.tsx
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getPatientCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';

interface CalendarItem {
  date: string;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  times?: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
  relatedId?: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
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
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
`;

export default function PatientCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, CalendarItem[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<CalendarItem[]>([]);
  const [modalDate, setModalDate] = useState<string>('');

  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);

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
            {it.itemType === 'MEDICATION' ? <>💊 {it.title}</> : <>🏥 {it.title}</>}
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
        <CommonModal
          title={`${selectedItem.date} 상세정보`}
          buttonText="확인"
          onClose={() => setItemDetailOpen(false)}
        >
          <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
            {selectedItem.itemType === 'MEDICATION' ? (
              <>
                <p>
                  <strong>제목:</strong> {selectedItem.title}
                </p>
                <p>
                  <strong>시간:</strong>{' '}
                  {`아침 ${selectedItem.times?.find((t) => t.meal === 'morning')?.time.slice(0, 5) ?? '--:--'} : `}
                  {`점심 ${selectedItem.times?.find((t) => t.meal === 'lunch')?.time.slice(0, 5) ?? '--:--'} : `}
                  {`저녁 ${selectedItem.times?.find((t) => t.meal === 'dinner')?.time.slice(0, 5) ?? '--:--'}`}
                </p>
                <p>
                  <strong>복용 시작일:</strong> {selectedItem.startDate}
                </p>
                <p>
                  <strong>복용 종료일:</strong> {selectedItem.endDate}
                </p>
              </>
            ) : (
              <p>
                <strong>일반진료:</strong> {selectedItem.title}
              </p>
            )}
          </div>
        </CommonModal>
      )}
    </>
  );
}
