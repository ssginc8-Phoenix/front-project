import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getDoctorCalendar, getAppointmentDetail } from '~/features/calendar/api/CalendarAPI';
import CommonModal from '~/components/common/CommonModal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f7f9fc;
  min-height: 100vh;
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

  .react-calendar__month-view__days__day--saturday {
    color: #1a5da2;
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
    word-break: keep-all;
    cursor: pointer;
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
  const [calendarData, setCalendarData] = useState<Record<string, CalendarItem[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<CalendarItem[]>([]);
  const [modalDate, setModalDate] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);

  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;

    const fetchData = async () => {
      try {
        const res = await getDoctorCalendar(year, month);
        const grouped = groupByDate(res.calendarItems || []);
        setCalendarData(grouped);
      } catch (err) {
        console.error('캘린더 데이터 로딩 실패', err);
      }
    };

    fetchData();
  }, [activeDate]);

  const groupByDate = (items: CalendarItem[]): Record<string, CalendarItem[]> => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
      },
      {} as Record<string, CalendarItem[]>,
    );
  };

  const handleAppointmentClick = async (item: CalendarItem) => {
    setSelectedItem(item);
    setItemDetailOpen(true);
    try {
      const detail = await getAppointmentDetail(item.relatedId);
      setAppointmentDetail(detail);
      console.log('예약 상세:', detail);
    } catch (error) {
      console.error('예약 상세 조회 실패:', error);
    }
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = date.toISOString().split('T')[0];
    const items = calendarData[dateStr];
    if (!items || items.length === 0) return null;

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
            🏥 {item.title}
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
    <>
      <Wrapper>
        <Legend>
          <div className="legend-item">
            <div className="dot appointment-dot" />
            <span>진료 일정</span>
          </div>
        </Legend>

        <CalendarWrapper>
          <Calendar
            locale="ko-KR"
            onChange={(date) => {
              if (date instanceof Date) setSelectedDate(date);
            }}
            value={selectedDate}
            tileContent={renderTileContent}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) setActiveDate(activeStartDate);
            }}
          />
        </CalendarWrapper>
      </Wrapper>

      {modalOpen && (
        <CommonModal
          title={`${modalDate} 진료 전체보기`}
          buttonText="닫기"
          onClose={() => setModalOpen(false)}
        >
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {modalItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleAppointmentClick(item)}
                style={{
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
              >
                🏥 {item.title} ({item.time})
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
              <strong>진료 시간:</strong> {appointmentDetail.appointmentTime}
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
    </>
  );
}
