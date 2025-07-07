import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';
import MedicationRegisterModal from '~/features/medication/components/MedicationRegisterModal';
import { getMyGuardianInfo } from '~/features/guardian/api/guardianAPI';

// --- Common sizes and media queries for responsive design ---
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;
  min-height: 100vh;
  background-color: #f5f7fa; /* Ensure consistent background */

  ${media.tablet} {
    padding: 2rem 1.5rem;
  }

  ${media.mobile} {
    padding: 1.5rem 1rem;
  }

  ${media.mobileSmall} {
    padding: 1rem 0.5rem;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 2rem;

  ${media.tablet} {
    gap: 1.8rem;
  }

  ${media.mobile} {
    gap: 1.5rem;
  }

  ${media.mobileSmall} {
    gap: 1.2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  gap: 1rem; /* Gap between legend and patient selector */

  ${media.mobile} {
    flex-direction: column; /* Stack vertically on mobile */
    align-items: flex-start; /* Align items to the start */
    gap: 1.2rem;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
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
    background-color: #1a5da2;
  }
  .medication-dot {
    background-color: #267e3e;
  }

  ${media.mobile} {
    gap: 1rem;
    .legend-item {
      font-size: 0.8rem;
    }
    .dot {
      width: 10px;
      height: 10px;
    }
  }

  ${media.mobileSmall} {
    gap: 0.8rem;
    .legend-item {
      font-size: 0.75rem;
    }
    .dot {
      width: 9px;
      height: 9px;
    }
  }
`;

export const StyledList = styled.ul`
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

export const StyledItem = styled.li<{ itemType: 'MEDICATION' | 'APPOINTMENT' }>`
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

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    .title {
      font-size: 1rem;
      font-weight: 600;
      color: ${({ itemType }) => (itemType === 'MEDICATION' ? '#15803d' : '#1e3a8a')};
    }
    .patient {
      font-size: 0.82rem;
      font-weight: 500;
      color: #64748b;
    }
  }

  .time {
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }

  ${media.mobile} {
    grid-template-columns: 40px 1fr auto;
    padding: 0.8rem 1rem;
    margin-bottom: 0.6rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    &::before {
      width: 4px;
      border-radius: 12px 0 0 12px;
    }
    .icon {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }
    .text {
      gap: 0.2rem;
      .title {
        font-size: 0.9rem;
      }
      .patient {
        font-size: 0.75rem;
      }
    }
    .time {
      font-size: 0.8rem;
    }
  }

  ${media.mobileSmall} {
    grid-template-columns: 36px 1fr auto;
    padding: 0.7rem 0.8rem;
    margin-bottom: 0.5rem;
    border-radius: 10px;
    &::before {
      width: 3px;
      border-radius: 10px 0 0 10px;
    }
    .icon {
      width: 36px;
      height: 36px;
      font-size: 1.1rem;
    }
    .text {
      .title {
        font-size: 0.85rem;
      }
      .patient {
        font-size: 0.7rem;
      }
    }
    .time {
      font-size: 0.75rem;
    }
  }
`;

const PatientSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-start;

  ${media.mobile} {
    justify-content: center; /* Center buttons on mobile */
    gap: 0.4rem;
  }
`;

const PatientButton = styled.button`
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 6px;
  background-color: #eef2f7;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &.active {
    background-color: #93c5fd;
    color: white;
    font-weight: bold;
  }
  &:hover {
    background-color: #dbeafe;
  }

  ${media.mobile} {
    padding: 0.4rem 0.7rem;
    border-radius: 5px;
    font-size: 0.75rem;
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

const AddMedicationButton = styled.button`
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: 1px dashed #1d4ed8;
  color: #1d4ed8;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e0edff;
  }

  ${media.mobile} {
    padding: 0.6rem 1.2rem; /* Slightly larger padding for better touch target */
    font-size: 0.85rem; /* Slightly larger font size */
    border-radius: 7px;
    align-self: center; /* Center button on mobile */
    width: 100%; /* Take up more width but not full */
    max-width: 200px; /* Prevent it from getting too wide on slightly larger mobiles */
  }

  ${media.mobileSmall} {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
    width: 100%; /* Adjust width for very small screens */
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
    max-width: 95%; /* Adjust for better fit on small mobile */
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
    gap: 0.6rem;
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
    font-size: 1.8rem;
    width: 40px;
    height: 40px;
  }

  ${media.mobileSmall} {
    font-size: 1.5rem;
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
    grid-template-columns: 80px 1fr; /* Adjust label column width */
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
  text-align: right;

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
  word-break: break-word;

  ${media.mobile} {
    font-size: 0.95rem;
  }

  ${media.mobileSmall} {
    font-size: 0.9rem;
  }
`;

export default function GuardianCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [fullList, setFullList] = useState<any[]>([]);
  const [patientList, setPatientList] = useState<{ name: string; patientGuardianId: number }[]>([]);
  const [selectedName, setSelectedName] = useState('전체');
  const [selectedPatient, setSelectedPatient] = useState<{
    name: string;
    patientGuardianId: number;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [modalDate, setModalDate] = useState('');

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [guardianUserId, setGuardianUserId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection

  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const fetchData = async (date: Date = activeDate) => {
    const res = await getGuardianCalendar(date.getFullYear(), date.getMonth() + 1);

    setFullList(res.calendarItemLists);

    const names = res.calendarItemLists
      .filter((it: any) => it.name)
      .map((it: any) => ({ name: it.name, patientGuardianId: it.patientGuardianId }));
    setPatientList(names);

    if (names.length === 1) {
      setSelectedName(names[0].name);
      setSelectedPatient(names[0]);
      updateCalendarData(res.calendarItemLists, names[0].name);
    } else {
      updateCalendarData(res.calendarItemLists, selectedName);
    }
  };

  useEffect(() => {
    getMyGuardianInfo()
      .then((info) => setGuardianUserId(info.guardianId))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData(activeDate);
  }, [activeDate]);

  // Effect to update isMobile state on resize
  useEffect(() => {
    const checkMobile = () => {
      // Use window.innerWidth for a more reliable check for mobile breakpoint
      setIsMobile(window.innerWidth <= parseInt(sizes.mobile.replace('px', ''), 10));
    };

    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile); // Add resize listener

    return () => window.removeEventListener('resize', checkMobile); // Cleanup
  }, []);

  const mealLabel = (meal: string) => {
    const map: Record<string, string> = {
      morning: '아침',
      lunch: '점심',
      dinner: '저녁',
      etc: '기타',
    };
    return map[meal] ?? meal;
  };

  const updateCalendarData = (lists: any[], name: string) => {
    const flat = lists.flatMap(({ name: pname, patientGuardianId, calendarItems }: any) =>
      name === '전체'
        ? calendarItems.map((i: any) => ({ ...i, name: pname, patientGuardianId }))
        : pname === name
          ? calendarItems.map((i: any) => ({ ...i, name: pname, patientGuardianId }))
          : [],
    );
    const grouped: Record<string, any[]> = {};
    flat.forEach((item) => (grouped[item.date] ||= []).push(item));
    setCalendarData(grouped);
  };

  const openDetail = async (item: any) => {
    if (item.itemType === 'MEDICATION') {
      const detail = await getMedicationSchedule(item.relatedId);
      setSelectedItem({ ...item, ...detail });
    } else {
      setSelectedItem(item);
      console.log(selectedItem); // This console.log will show the state before it's updated in the next render cycle
    }
    setItemDetailOpen(true);
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const ds = getLocalDateString(date);
    const items = (calendarData[ds] || []).filter((it: any) => {
      if (it.itemType === 'MEDICATION') {
        if (it.startDate && new Date(ds) < new Date(it.startDate)) return false;
        if (it.endDate && new Date(ds) > new Date(it.endDate)) return false;
      }
      return true;
    });
    if (!items.length) return null;
    items.sort((a, b) =>
      a.itemType === 'MEDICATION' && b.itemType !== 'MEDICATION'
        ? -1
        : a.itemType !== 'MEDICATION' && b.itemType === 'MEDICATION'
          ? 1
          : 0,
    );
    return (
      <div className="calendar-day-wrapper">
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={`${ds}-${idx}`}
            className={`calendar-event ${item.itemType === 'MEDICATION' ? 'medication' : 'appointment'}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent calendar tile click from firing
              openDetail(item);
            }}
          >
            {isMobile ? ( // Conditional rendering based on isMobile
              item.itemType === 'MEDICATION' ? (
                <>💊 복약</>
              ) : (
                <>🏥 진료</>
              )
            ) : item.itemType === 'MEDICATION' ? (
              <>💊 {item.title}</>
            ) : (
              <>🏥 {item.title}</>
            )}
          </div>
        ))}
        {items.length > 3 && (
          <div
            style={{ fontSize: '0.7rem', color: '#888', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent calendar tile click from firing
              setModalItems(items);
              setModalDate(ds);
              setModalOpen(true);
            }}
          >
            +{items.length - 3}개 더보기
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <ContentBox>
        <Header>
          <Legend>
            <div className="legend-item">
              <div className="dot appointment-dot" /> 일반진료
            </div>
            <div className="legend-item">
              <div className="dot medication-dot" /> 약 복용
            </div>
          </Legend>
          <PatientSelector>
            <PatientButton
              className={selectedName === '전체' ? 'active' : ''}
              onClick={() => {
                setSelectedName('전체');
                setSelectedPatient(null);
                updateCalendarData(fullList, '전체');
              }}
            >
              전체
            </PatientButton>
            {patientList.map((p) => (
              <PatientButton
                key={p.patientGuardianId}
                className={selectedName === p.name ? 'active' : ''}
                onClick={() => {
                  setSelectedName(p.name);
                  setSelectedPatient(p);
                  updateCalendarData(fullList, p.name);
                }}
              >
                {p.name}
              </PatientButton>
            ))}
          </PatientSelector>
        </Header>

        <AddMedicationButton
          onClick={() => {
            setSelectedItem(null); // Ensure no previous item is selected when opening for new registration
            setRegisterModalOpen(true);
          }}
        >
          + 약 등록
        </AddMedicationButton>

        <CalendarWrapper>
          <Calendar
            locale="en-US"
            onChange={(date) => {
              if (date instanceof Date) {
                setSelectedDate(date);
                const ds = getLocalDateString(date);
                if (calendarData[ds]?.length) {
                  setModalItems(calendarData[ds]);
                  setModalDate(ds);
                  setModalOpen(true);
                }
              }
            }}
            value={selectedDate}
            tileContent={renderTileContent}
            onActiveStartDateChange={({ activeStartDate }) =>
              activeStartDate && setActiveDate(activeStartDate)
            }
          />
        </CalendarWrapper>

        {registerModalOpen && guardianUserId !== null && (
          <Overlay onClick={() => setRegisterModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <MedicationRegisterModal
                date={selectedDate.toISOString().slice(0, 10)}
                patientGuardianId={selectedPatient?.patientGuardianId}
                patients={patientList}
                initialData={
                  selectedItem?.itemType === 'MEDICATION'
                    ? {
                        medicationId: selectedItem.relatedId,
                        medicationName: selectedItem.title,
                        days: selectedItem.days,
                        startDate: selectedItem.startDate!,
                        endDate: selectedItem.endDate!,
                        times: selectedItem.times,
                      }
                    : undefined
                }
                onClose={async () => {
                  await fetchData(); // Re-fetch data after modal closes to update calendar
                  setRegisterModalOpen(false);
                  setSelectedItem(null); // Clear selected item
                }}
              />
            </div>
          </Overlay>
        )}

        {modalOpen && (
          <CommonModal
            title={`${modalDate} 일정 전체보기`}
            buttonText="닫기"
            onClose={() => setModalOpen(false)}
          >
            <StyledList>
              {modalItems
                .slice()
                .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
                .map((item) => (
                  <StyledItem
                    key={item.relatedId ?? item.title} // Use a more robust key if possible, e.g., unique ID from backend
                    itemType={item.itemType}
                    onClick={() => {
                      setModalOpen(false); // Close the list modal first
                      openDetail(item);
                    }}
                  >
                    <div className="icon">{item.itemType === 'MEDICATION' ? '💊' : '🏥'}</div>

                    <div className="text">
                      <div className="title">{item.title}</div>
                      <div className="patient">{item.name}</div>
                    </div>

                    {item.time && <div className="time">{item.time.slice(0, 5)}</div>}
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
                    <Label>환자 이름</Label>
                    <Value>{selectedItem.name}</Value>

                    <Label>복약 이름</Label>
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
                    <Label>환자</Label>
                    <Value>{selectedItem.name}</Value>

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
      </ContentBox>
    </PageContainer>
  );
}
