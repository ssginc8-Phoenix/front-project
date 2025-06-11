import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getHospitalCalendar, getAppointmentDetail } from '~/features/calendar/api/CalendarAPI';
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
`;

const DoctorSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DoctorButton = styled.button`
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

export default function HospitalCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [fullList, setFullList] = useState<any[]>([]);
  const [doctorNames, setDoctorNames] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('전체');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [modalDate, setModalDate] = useState<string>('');
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);

  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;

    const fetchData = async () => {
      const res = await getHospitalCalendar(year, month);
      setFullList(res.calendarItemLists);
      setDoctorNames(res.calendarItemLists.map((d: any) => d.name));
      updateCalendarData(res.calendarItemLists, '전체');
    };

    fetchData();
  }, [activeDate]);

  const updateCalendarData = (lists: any[], name: string) => {
    const flat = lists.flatMap(({ name: docName, calendarItems }) =>
      name === '전체'
        ? calendarItems.map((item: any) => ({ ...item, name: docName }))
        : docName === name
          ? calendarItems.map((item: any) => ({ ...item, name: docName }))
          : [],
    );

    const grouped = flat.reduce((acc: Record<string, any[]>, item: any) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});

    setCalendarData(grouped);
  };

  const handleAppointmentClick = async (item: any) => {
    setSelectedItem(item);
    setItemDetailOpen(true);
    try {
      const detail = await getAppointmentDetail(item.relatedId);
      setAppointmentDetail(detail);
    } catch (error) {
      console.error('예약 상세 조회 실패:', error);
    }
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = date.toISOString().split('T')[0];
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
          <DoctorSelector>
            <DoctorButton
              onClick={() => {
                setSelectedDoctor('전체');
                updateCalendarData(fullList, '전체');
              }}
              className={selectedDoctor === '전체' ? 'active' : ''}
            >
              전체
            </DoctorButton>
            {doctorNames.map((name) => (
              <DoctorButton
                key={name}
                onClick={() => {
                  setSelectedDoctor(name);
                  updateCalendarData(fullList, name);
                }}
                className={selectedDoctor === name ? 'active' : ''}
              >
                {name}
              </DoctorButton>
            ))}
          </DoctorSelector>
        </Header>

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
      </ContentBox>

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
    </PageContainer>
  );
}
