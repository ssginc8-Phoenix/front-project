// GuardianCalendar.tsx
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';
import CommonModal from '~/components/common/CommonModal';
import MedicationRegisterModal from '~/features/medication/components/MedicationRegisterModal';
import { getMyGuardianInfo } from '~/features/guardian/api/guardianAPI';
import { deleteMedicationSchedule } from '~/features/medication/api/medicationAPI';
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
    transition: background 0.2s ease;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
  &:hover {
    background-color: #e0edff;
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
      .then((info) => setGuardianUserId(info.userId))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData(activeDate);
  }, [activeDate]);

  const updateCalendarData = (lists: any[], name: string) => {
    const flat = lists.flatMap(({ name: pname, patientGuardianId, calendarItems }: any) =>
      name === '전체'
        ? calendarItems.map((i: any) => ({
            ...i,
            name: pname,
            patientGuardianId, // ← 여기에 ID 추가
          }))
        : pname === name
          ? calendarItems.map((i: any) => ({
              ...i,
              name: pname,
              patientGuardianId, // ← 여기에 ID 추가
            }))
          : [],
    );
    const grouped = flat.reduce((acc: Record<string, any[]>, item: any) => {
      (acc[item.date] ||= []).push(item);
      return acc;
    }, {});
    setCalendarData(grouped);
  };

  // 상세 모달 열기 전에 times 정보를 백엔드에서 가져옵니다.
  const openDetail = async (item: any) => {
    if (item.itemType === 'MEDICATION') {
      try {
        const detail = await getMedicationSchedule(item.relatedId);
        setSelectedItem({ ...item, ...detail });
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
    const ds = getLocalDateString(date);
    const items = (calendarData[ds] || []).filter((it: any) => {
      if (it.itemType === 'MEDICATION') {
        if (it.startDate && new Date(ds) < new Date(it.startDate)) return false;
        if (it.endDate && new Date(ds) > new Date(it.endDate)) return false;
      }
      return true;
    });
    if (!items.length) return null;

    items.sort((a: any, b: any) => {
      if (a.itemType === 'MEDICATION' && b.itemType !== 'MEDICATION') return -1;
      if (a.itemType !== 'MEDICATION' && b.itemType === 'MEDICATION') return 1;
      return 0;
    });

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
            style={{ cursor: 'pointer' }}
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
              <div className="dot appointment-dot" />
              <span>일반진료</span>
            </div>
            <div className="legend-item">
              <div className="dot medication-dot" />
              <span>약 복용</span>
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
            if (!selectedPatient) {
              alert('환자 정보를 확인해주세요.');
              return;
            }
            // ❗ 기존 선택 항목 초기화
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

        {/* 등록/수정 모달 */}
        {registerModalOpen && guardianUserId !== null && (selectedPatient || selectedItem) && (
          <Overlay onClick={() => setRegisterModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <MedicationRegisterModal
                date={selectedDate.toISOString().slice(0, 10)}
                // selectedPatient가 없으면 selectedItem.patientGuardianId 사용
                patientGuardianId={
                  selectedPatient
                    ? selectedPatient.patientGuardianId
                    : selectedItem.patientGuardianId
                }
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

        {/* 날짜별 리스트 모달 */}
        {modalOpen && (
          <CommonModal
            title={`${modalDate} 일정`}
            buttonText="닫기"
            onClose={() => setModalOpen(false)}
          >
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {modalItems.map((item, idx) => (
                <li
                  key={`${modalDate}-${idx}`}
                  onClick={() => {
                    setModalOpen(false);
                    openDetail(item);
                  }}
                  style={{
                    marginBottom: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: item.itemType === 'MEDICATION' ? '#e6fbe5' : '#e0f0ff',
                    color: item.itemType === 'MEDICATION' ? '#267e3e' : '#1a5da2',
                  }}
                >
                  {item.itemType === 'MEDICATION' ? '💊' : '🏥'} {item.name} - {item.title}
                </li>
              ))}
            </ul>
          </CommonModal>
        )}

        {/* 상세정보 모달 */}
        {itemDetailOpen && selectedItem && (
          <CommonModal
            title={`${selectedItem.date} 상세정보`}
            buttonText=""
            onClose={() => setItemDetailOpen(false)}
          >
            <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    border: '2px solid #7dd3fc',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {selectedItem.name}
                </span>
                <span
                  style={{
                    border: '2px solid #000',
                    backgroundColor: '#003458',
                    padding: '2px 10px',
                    color: '#ECEAE4',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {selectedItem.itemType === 'MEDICATION' ? '약 복용' : '일반진료'}
                </span>
              </div>

              <p>
                <strong>제목:</strong> {selectedItem.title}
              </p>

              {/* 아침 : 점심 : 저녁 요약 */}
              {selectedItem.itemType === 'MEDICATION' && (
                <p>
                  <strong>시간:</strong>{' '}
                  {['morning', 'lunch', 'dinner'].map((m, i) => {
                    const e = selectedItem.times?.find((t: any) => t.meal === m);
                    const lb = m === 'morning' ? '아침' : m === 'lunch' ? '점심' : '저녁';
                    const ts = e ? e.time.slice(0, 5) : '--:--';
                    return (
                      <span key={`${m}-${i}`}>
                        {lb} {ts}
                        {i < 2 ? ' : ' : ''}
                      </span>
                    );
                  })}
                </p>
              )}

              {/* 복용 시작/종료일 */}
              {selectedItem.itemType === 'MEDICATION' && (
                <>
                  <p>
                    <strong>복용 시작일:</strong> {selectedItem.startDate}
                  </p>
                  <p>
                    <strong>복용 종료일:</strong> {selectedItem.endDate}
                  </p>
                </>
              )}

              {/* 수정/삭제 버튼 */}
              {selectedItem.itemType === 'MEDICATION' && (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                  }}
                >
                  <button
                    onClick={() => {
                      setItemDetailOpen(false);
                      setRegisterModalOpen(true);
                    }}
                    style={{
                      background: '#e0e7ff',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('정말 삭제하시겠습니까?')) {
                        await deleteMedicationSchedule(selectedItem.relatedId);
                        setItemDetailOpen(false);
                        await fetchData();
                      }
                    }}
                    style={{
                      background: '#fee2e2',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#b91c1c',
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </CommonModal>
        )}
      </ContentBox>
    </PageContainer>
  );
}
