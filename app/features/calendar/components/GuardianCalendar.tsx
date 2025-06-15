import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI';
import CommonModal from '~/components/common/CommonModal';
import MedicationRegisterModal from '~/features/medication/components/MedicationRegisterModal';
import { getMyGuardianInfo } from '~/features/guardian/api/guardianAPI';
import { deleteMedicationSchedule } from '~/features/medication/api/medicationAPI';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #f5f7fa;
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

  // ❗️ fetchData 전면 수정
  const fetchData = async (date: Date = activeDate) => {
    try {
      // 1) 보호자 ID만 조회
      const { guardianId } = await getMyGuardianInfo();
      setGuardianUserId(guardianId);

      // 2) 달력 데이터 가져오기
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const res = await getGuardianCalendar(year, month);

      // 3) 서버에서 내려준 calendarItemLists 그대로 사용
      const lists = res.calendarItemLists || [];
      setFullList(lists);

      // 4) patientList: 중복 제거하여 {patientGuardianId, name} 목록 생성
      const map = new Map<number, string>();
      lists.forEach((li) => map.set(li.patientGuardianId, li.name));
      const unique = Array.from(map.entries()).map(([patientGuardianId, name]) => ({
        patientGuardianId,
        name,
      }));
      setPatientList(unique);

      // 5) 처음 선택: 단일 환자면 자동 선택, 다중이면 '전체'
      if (unique.length === 1) {
        setSelectedName(unique[0].name);
        setSelectedPatient(unique[0]);
        updateCalendarData(lists, unique[0].name);
      } else {
        updateCalendarData(lists, selectedName);
      }
    } catch (e) {
      console.error('데이터 로드 실패', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData(activeDate);
  }, [activeDate]);

  const updateCalendarData = (lists: any[], name: string) => {
    const flat = lists.flatMap(({ name: pname, calendarItems }: any) =>
      name === '전체'
        ? calendarItems.map((item: any) => ({ ...item, name: pname }))
        : pname === name
          ? calendarItems.map((item: any) => ({ ...item, name: pname }))
          : [],
    );
    const grouped = flat.reduce((acc: Record<string, any[]>, item: any) => {
      (acc[item.date] ||= []).push(item);
      return acc;
    }, {});
    setCalendarData(grouped);
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dateStr = date.toISOString().split('T')[0];
    const items = (calendarData[dateStr] || []).filter((item) => {
      if (item.itemType === 'MEDICATION') {
        if (item.startDate && new Date(dateStr) < new Date(item.startDate)) return false;
        if (item.endDate && new Date(dateStr) > new Date(item.endDate)) return false;
      }
      return true;
    });

    if (!items.length) return null;

    // MEDICATION 우선 정렬
    items.sort((a, b) => {
      if (a.itemType === 'MEDICATION' && b.itemType !== 'MEDICATION') return -1;
      if (a.itemType !== 'MEDICATION' && b.itemType === 'MEDICATION') return 1;
      return 0;
    });

    return (
      <div className="calendar-day-wrapper">
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={`${dateStr}-${idx}`}
            className={`calendar-event ${item.itemType === 'MEDICATION' ? 'medication' : 'appointment'}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
              setItemDetailOpen(true);
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
              setModalDate(dateStr);
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
            if (!selectedPatient || guardianUserId === null) {
              alert('환자와 보호자 정보를 확인해주세요.');
              return;
            }
            setRegisterModalOpen(true);
          }}
        >
          + 약 등록
        </AddMedicationButton>

        <CalendarWrapper>
          <Calendar
            locale="ko-KR"
            onChange={(date) => {
              if (date instanceof Date) {
                setSelectedDate(date);
                const dateStr = date.toISOString().split('T')[0];
                const items = calendarData[dateStr];
                if (items?.length) {
                  setModalItems(items);
                  setModalDate(dateStr);
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

        {/* 모달 렌더링 로직은 기존 그대로 */}
        {registerModalOpen && selectedPatient && guardianUserId !== null && (
          <CommonModal
            title={selectedItem ? '약 수정' : '약 등록'}
            buttonText=""
            onClose={() => {
              setRegisterModalOpen(false);
              setSelectedItem(null);
            }}
          >
            <MedicationRegisterModal
              date={selectedDate.toISOString().split('T')[0]}
              patientGuardianId={selectedPatient.patientGuardianId}
              initialData={
                selectedItem?.itemType === 'MEDICATION'
                  ? {
                      medicationId: selectedItem.relatedId,
                      medicationName: selectedItem.title,
                      timeToTake: selectedItem.time,
                      days: selectedItem.days || [],
                      startDate: selectedItem.startDate,
                      endDate: selectedItem.endDate,
                    }
                  : undefined
              }
              onClose={async () => {
                await fetchData();
                setRegisterModalOpen(false);
                setSelectedItem(null);
              }}
            />
          </CommonModal>
        )}

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
                    setSelectedItem(item);
                    setItemDetailOpen(true);
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

        {itemDetailOpen && selectedItem && (
          <CommonModal
            title={`${selectedItem.date} 상세정보`}
            buttonText=""
            onClose={() => setItemDetailOpen(false)}
          >
            <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
              <p>
                <strong>환자:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>종류:</strong>{' '}
                {selectedItem.itemType === 'MEDICATION' ? '약 복용' : '일반진료'}
              </p>
              <p>
                <strong>제목:</strong> {selectedItem.title}
              </p>
              <p>
                <strong>시간:</strong> {selectedItem.time}
              </p>
              {selectedItem.itemType === 'MEDICATION' && (
                <>
                  <p>
                    <strong>시작일:</strong> {selectedItem.startDate}
                  </p>
                  <p>
                    <strong>종료일:</strong> {selectedItem.endDate}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1rem',
                      justifyContent: 'flex-end',
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
                          try {
                            await deleteMedicationSchedule(selectedItem.relatedId);
                            alert('삭제되었습니다.');
                            setItemDetailOpen(false);
                            await fetchData();
                          } catch {
                            alert('삭제에 실패했습니다.');
                          }
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
                </>
              )}
            </div>
          </CommonModal>
        )}
      </ContentBox>
    </PageContainer>
  );
}
