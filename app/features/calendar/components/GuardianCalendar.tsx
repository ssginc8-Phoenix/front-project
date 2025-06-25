import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';
import MedicationRegisterModal from '~/features/medication/components/MedicationRegisterModal';
import { getMyGuardianInfo } from '~/features/guardian/api/guardianAPI';
import { Overlay } from '~/features/hospitals/components/waiting/WaitingModal';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;
  min-height: 100vh;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Legend = styled.div`
  display: flex;
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
`;

export const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
      font:
        600 1rem/1.25 'Pretendard',
        sans-serif;
      color: ${({ itemType }) => (itemType === 'MEDICATION' ? '#15803d' : '#1e3a8a')};
    }
    .patient {
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

const PatientSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

const AddMedicationButton = styled.button`
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: 1px dashed #1d4ed8;
  color: #1d4ed8;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  &:hover {
    background-color: #e0edff;
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
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
`;

const HeaderTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 1rem;
  column-gap: 1rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  text-align: right;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #0f172a;
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
      .then((info) => setGuardianUserId(info.userId))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData(activeDate);
  }, [activeDate]);

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
      console.log(selectedItem);
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
              e.stopPropagation();
              openDetail(item);
            }}
          >
            {item.itemType === 'MEDICATION' ? '💊' : '🏥'} {item.title}
          </div>
        ))}
        {items.length > 3 && (
          <div
            style={{ fontSize: '0.7rem', color: '#888', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
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
            setSelectedItem(null);
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
                  await fetchData();
                  setRegisterModalOpen(false);
                  setSelectedItem(null);
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
                    key={item.relatedId ?? item.title}
                    itemType={item.itemType}
                    onClick={() => {
                      setModalOpen(false);
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
                            .join(', ')
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
