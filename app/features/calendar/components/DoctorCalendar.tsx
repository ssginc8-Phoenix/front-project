import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getAppointmentDetail, getDoctorCalendar } from '~/features/calendar/api/CalendarAPI';
import CommonModal from '~/components/common/CommonModal';

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
`;

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    background: #fff;
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
    background-color: #e0f0ff;
    color: #1a5da2;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .react-calendar__tile--now {
    background: #e3f2fd;
    font-weight: bold;
  }
  .react-calendar__tile--active {
    background: #90caf9 !important;
    color: #fff;
  }
`;

/* Modal list styling (보호자 캘린더와 통일) */
const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledItem = styled.li`
  padding: 1rem;
  background: #f6f9fe;
  border-left: 6px solid #2563eb;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

/* ----------------------------- 타입 정의 ----------------------------- */
interface AppointmentDetail {
  appointmentId: number;
  appointmentTime: string;
  appointmentType: string;
  createdAt: string;
  doctorId: number;
  doctorName: string;
  hospitalId: number;
  hospitalName: string;
  patientGuardianId: number;
  patientName: string;
  paymentType: string;
  question: string;
  status: string;
  symptom: string;
}

/* ----------------------------- 컴포넌트 ----------------------------- */
export default function DoctorCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  // 모달 관련 state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [modalDate, setModalDate] = useState('');

  // 상세 정보
  const [detailOpen, setDetailOpen] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);

  /* util */
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  /* 데이터 로드 */
  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;
    (async () => {
      const res = await getDoctorCalendar(year, month);
      const grouped: Record<string, any[]> = {};
      res.calendarItems.forEach((it: any) => {
        const key = formatDate(new Date(it.date));
        (grouped[key] ||= []).push(it);
      });
      setCalendarData(grouped);
    })();
  }, [activeDate]);

  /* 일정 전체 보기 */
  const openFullList = (dateStr: string) => {
    setModalDate(dateStr);
    setModalItems(calendarData[dateStr] || []);
    setModalOpen(true);
  };

  /* 예약 상세 보기 */
  const openDetail = async (item: any) => {
    try {
      const detail = await getAppointmentDetail(item.relatedId);
      setAppointmentDetail(detail);
      setDetailOpen(true);
    } catch (err) {
      console.error('상세 조회 실패', err);
    }
  };

  /* 캘린더 타일 렌더링 */
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dateStr = formatDate(date);
    const items = calendarData[dateStr];
    if (!items) return null;

    return (
      <div className="calendar-day-wrapper" onClick={() => openFullList(dateStr)}>
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="calendar-event"
            onClick={(e) => {
              e.stopPropagation(); // 날짜 셀 클릭 방지
              openFullList(dateStr);
            }}
          >
            🏥 {item.name} - {item.title}
          </div>
        ))}
        {items.length > 3 && (
          <div style={{ fontSize: '0.7rem', color: '#888' }}>+{items.length - 3}개 더보기</div>
        )}
      </div>
    );
  };

  /* ----------------------------- JSX ----------------------------- */
  return (
    <PageContainer>
      <ContentBox>
        <Header>
          <Legend>
            <div className="legend-item">
              <div className="dot appointment-dot" /> 진료 일정
            </div>
          </Legend>
        </Header>

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
      </ContentBox>

      {/* 날짜별 전체 목록 모달 */}
      {modalOpen && (
        <CommonModal
          title={`${modalDate} 진료 전체보기`}
          buttonText="닫기"
          onClose={() => setModalOpen(false)}
        >
          <StyledList>
            {modalItems.map((item, idx) => (
              <StyledItem key={idx} onClick={() => openDetail(item)}>
                🏥 {item.name} - {item.title} ({item.time})
              </StyledItem>
            ))}
          </StyledList>
        </CommonModal>
      )}

      {/* 예약 상세 모달 */}
      {detailOpen && appointmentDetail && (
        <CommonModal
          title={`${appointmentDetail.appointmentTime.split('T')[0]} 예약 상세`}
          buttonText="확인"
          onClose={() => setDetailOpen(false)}
        >
          <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
            <p>
              <strong>환자:</strong> {appointmentDetail.patientName}
            </p>
            <p>
              <strong>날짜:</strong> {appointmentDetail.appointmentTime.split('T')[0]}
            </p>
            <p>
              <strong>시간:</strong> {appointmentDetail.appointmentTime.split('T')[1]}
            </p>
            <p>
              <strong>증상:</strong> {appointmentDetail.symptom}
            </p>
            <p>
              <strong>질문:</strong> {appointmentDetail.question}
            </p>
          </div>
        </CommonModal>
      )}
    </PageContainer>
  );
}
