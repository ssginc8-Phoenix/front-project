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
    background: white;
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
  }
  .calendar-day-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
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
  .react-calendar__month-view__days__day:nth-child(7n) {
    color: black !important;
  }
`;

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

export default function DoctorCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [fullList, setFullList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [modalDate, setModalDate] = useState<string>('');
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;

    const fetchData = async () => {
      const res = await getDoctorCalendar(year, month);

      setFullList(res.calendarItems);
      updateCalendarData(res.calendarItems);
    };
    fetchData();
  }, [activeDate]);

  const updateCalendarData = (items: any[]) => {
    const grouped: Record<string, any[]> = {};
    items.forEach((item) => {
      const key = formatDate(new Date(item.date));
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    setCalendarData(grouped);
  };

  const handleAppointmentClick = async (item: any) => {
    setSelectedItem(item);
    setItemDetailOpen(true);
    const detail = await getAppointmentDetail(item.relatedId);
    setAppointmentDetail(detail);
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dateStr = formatDate(date);
    const items = calendarData[dateStr];
    if (!items) return null;

    return (
      <div className="calendar-day-wrapper">
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="calendar-event"
            onClick={(e) => {
              e.stopPropagation();
              handleAppointmentClick(item);
            }}
          >
            🏥 {item.name} - {item.title}
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
              <span>진료 일정</span>
            </div>
          </Legend>
        </Header>

        <CalendarWrapper>
          <Calendar
            locale="en-US"
            value={selectedDate}
            onChange={(date) => date instanceof Date && setSelectedDate(date)}
            tileContent={renderTileContent}
            onActiveStartDateChange={({ activeStartDate }) =>
              activeStartDate && setActiveDate(activeStartDate)
            }
          />
        </CalendarWrapper>
      </ContentBox>

      {modalOpen && (
        <CommonModal title={modalDate} buttonText="닫기" onClose={() => setModalOpen(false)}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {modalItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleAppointmentClick(item)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                🏥 {item.name} - {item.title} ({item.time})
              </li>
            ))}
          </ul>
        </CommonModal>
      )}

      {itemDetailOpen && appointmentDetail && (
        <CommonModal
          title={`${appointmentDetail.appointmentTime.split('T')[0]} 예약 상세`}
          buttonText="확인"
          onClose={() => {
            setItemDetailOpen(false);
            setAppointmentDetail(null);
          }}
        >
          <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
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
