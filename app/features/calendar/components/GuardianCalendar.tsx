import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';
import MedicationRegisterModal from '~/features/medication/components/MedicationRegisterModal';
import { getMyGuardianInfo } from '~/features/guardian/api/guardianAPI';

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
  padding: 1.5rem 1rem; /* 모바일에서 패딩 줄임 */
  min-height: 100vh;
  @media (min-width: 768px) {
    padding: 3rem 2rem; /* 태블릿 이상에서 패딩 유지 */
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 1.5rem; /* 모바일에서 간격 줄임 */
  @media (min-width: 768px) {
    gap: 2rem; /* 태블릿 이상에서 간격 유지 */
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column; /* 모바일에서 세로로 배치 */
  justify-content: space-between;
  align-items: flex-start; /* 모바일에서 왼쪽 정렬 */
  gap: 1rem; /* 모바일에서 요소 간 간격 추가 */
  @media (min-width: 768px) {
    flex-direction: row; /* 태블릿 이상에서 가로로 배치 */
    align-items: center;
    gap: 0; /* 가로 배치 시 간격 초기화 */
  }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 */
  gap: 1rem; /* 모바일에서 간격 줄임 */
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem; /* 모바일에서 폰트 크기 줄임 */
  }
  .dot {
    width: 10px; /* 모바일에서 크기 줄임 */
    height: 10px; /* 모바일에서 크기 줄임 */
    border-radius: 50%;
  }
  .appointment-dot {
    background-color: #1a5da2;
  }
  .medication-dot {
    background-color: #267e3e;
  }
  @media (min-width: 768px) {
    gap: 1.25rem;
    .legend-item {
      font-size: 0.9rem;
    }
    .dot {
      width: 12px;
      height: 12px;
    }
  }
`;

export const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const StyledItem = styled.li<{ itemType: 'MEDICATION' | 'APPOINTMENT' }>`
  display: grid;
  grid-template-columns: 40px 1fr auto; /* 모바일에서 아이콘 크기 줄임 */
  align-items: center;
  padding: 0.8rem 1rem; /* 모바일에서 패딩 줄임 */
  margin-bottom: 0.6rem; /* 모바일에서 마진 줄임 */
  border-radius: 12px; /* 모바일에서 테두리 둥글기 줄임 */
  background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#f4fcf7' : '#f6f9fe')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 모바일에서 그림자 약하게 */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px; /* 모바일에서 너비 줄임 */
    border-radius: 12px 0 0 12px; /* 모바일에서 테두리 둥글기 줄임 */
    background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#34c759' : '#2563eb')};
  }
  cursor: pointer;
  transition: transform 0.12s ease;
  &:hover {
    transform: translateY(-2px);
  }
  .icon {
    width: 40px; /* 모바일에서 크기 줄임 */
    height: 40px; /* 모바일에서 크기 줄임 */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem; /* 모바일에서 폰트 크기 줄임 */
    background: ${({ itemType }) => (itemType === 'MEDICATION' ? '#d1fadf' : '#dbe8ff')};
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem; /* 모바일에서 간격 줄임 */
    .title {
      font-size: 0.9rem; /* 모바일에서 폰트 크기 줄임 */
      font-weight: 600;
      color: ${({ itemType }) => (itemType === 'MEDICATION' ? '#15803d' : '#1e3a8a')};
    }
    .patient {
      font-size: 0.75rem; /* 모바일에서 폰트 크기 줄임 */
      font-weight: 500;
      color: #64748b;
    }
  }
  .time {
    font-size: 0.8rem; /* 모바일에서 폰트 크기 줄임 */
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    grid-template-columns: 44px 1fr auto;
    padding: 1rem 1.25rem;
    margin-bottom: 0.7rem;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    &::before {
      width: 6px;
      border-radius: 14px 0 0 14px;
    }
    .icon {
      width: 44px;
      height: 44px;
      font-size: 1.35rem;
    }
    .text {
      gap: 0.25rem;
      .title {
        font-size: 1rem;
      }
      .patient {
        font-size: 0.82rem;
      }
    }
    .time {
      font-size: 0.9rem;
    }
  }
`;

const PatientSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem; /* 모바일에서 간격 줄임 */
  justify-content: center; /* 모바일에서 중앙 정렬 */
  @media (min-width: 768px) {
    gap: 0.5rem;
    justify-content: flex-start; /* 태블릿 이상에서 왼쪽 정렬 */
  }
`;

const PatientButton = styled.button`
  padding: 0.4rem 0.7rem; /* 모바일에서 패딩 줄임 */
  border: none;
  border-radius: 5px; /* 모바일에서 테두리 둥글기 줄임 */
  background-color: #eef2f7;
  font-size: 0.75rem; /* 모바일에서 폰트 크기 줄임 */
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
  @media (min-width: 768px) {
    padding: 0.5rem 0.9rem;
    border-radius: 6px;
    font-size: 0.85rem;
  }
`;

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    background: white;
    border-radius: 12px; /* 모바일에서 테두리 둥글기 줄임 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* 모바일에서 그림자 약하게 */
    padding: 0.8rem; /* 모바일에서 패딩 줄임 */
    border: none;
  }
  .react-calendar__tile {
    border-radius: 10px; /* 모바일에서 테두리 둥글기 줄임 */
    padding: 0.5rem 0.3rem; /* 모바일에서 패딩 줄임 */
    min-height: 80px; /* 모바일에서 높이 줄임 */
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
    font-size: 0.65rem; /* 모바일에서 폰트 크기 줄임 */
    padding: 2px 4px; /* 모바일에서 패딩 줄임 */
    margin-top: 1px; /* 모바일에서 마진 줄임 */
    border-radius: 4px; /* 모바일에서 테두리 둥글기 줄임 */
    display: flex;
    align-items: center;
    gap: 3px; /* 모바일에서 간격 줄임 */
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

  @media (min-width: 768px) {
    .react-calendar {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      padding: 1rem;
    }
    .react-calendar__tile {
      border-radius: 12px;
      padding: 0.75rem 0.5rem;
      min-height: 100px;
    }
    .calendar-event {
      font-size: 0.7rem;
      padding: 3px 6px;
      margin-top: 2px;
      border-radius: 6px;
      gap: 4px;
    }
  }
`;

const AddMedicationButton = styled.button`
  align-self: flex-end;
  padding: 0.5rem 1rem; /* 모바일에서 패딩 줄임 */
  font-size: 0.8rem; /* 모바일에서 폰트 크기 줄임 */
  border: 1px dashed #1d4ed8;
  color: #1d4ed8;
  border-radius: 6px; /* 모바일에서 테두리 둥글기 줄임 */
  background: #fff;
  cursor: pointer;
  &:hover {
    background-color: #e0edff;
  }
  @media (min-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const DetailContainer = styled.div`
  background: #f9fafb;
  border-radius: 12px; /* 모바일에서 테두리 둥글기 줄임 */
  padding: 1.5rem; /* 모바일에서 패딩 줄임 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 모바일에서 그림자 약하게 */
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* 모바일에서 간격 줄임 */
  position: relative;
  max-width: 100%; /* 모바일에서 너비 100% */
  margin: 0 auto;
  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    gap: 1.6rem;
    max-width: 500px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem; /* 모바일에서 간격 줄임 */
`;

const HeaderIcon = styled.div`
  font-size: 1.8rem; /* 모바일에서 폰트 크기 줄임 */
  background: #e0f2fe;
  border-radius: 50%;
  width: 40px; /* 모바일에서 크기 줄임 */
  height: 40px; /* 모바일에서 크기 줄임 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  @media (min-width: 768px) {
    font-size: 2rem;
    width: 48px;
    height: 48px;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 1.1rem; /* 모바일에서 폰트 크기 줄임 */
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr; /* 모바일에서 라벨 컬럼 너비 줄임 */
  row-gap: 0.8rem; /* 모바일에서 행 간격 줄임 */
  column-gap: 0.8rem; /* 모바일에서 열 간격 줄임 */
  @media (min-width: 768px) {
    grid-template-columns: 120px 1fr;
    row-gap: 1rem;
    column-gap: 1rem;
  }
`;

const Label = styled.div`
  font-size: 0.85rem; /* 모바일에서 폰트 크기 줄임 */
  font-weight: 500;
  color: #475569;
  text-align: right;
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Value = styled.div`
  font-size: 0.95rem; /* 모바일에서 폰트 크기 줄임 */
  color: #0f172a;
  word-break: break-word; /* 긴 텍스트 줄바꿈 */
  @media (min-width: 768px) {
    font-size: 1rem;
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
