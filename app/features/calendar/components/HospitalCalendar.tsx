import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getHospitalCalendar, getAppointmentDetail } from '~/features/calendar/api/CalendarAPI';
import CommonModal from '~/components/common/CommonModal';
import { X } from 'lucide-react'; // Import X icon for the detailed modal's internal close button

// --- Responsive Design Common Sizes and Media Queries ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px', // Original mobile breakpoint
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;

  ${media.tablet} {
    padding: 2rem 1rem; /* Adjust padding for tablets */
  }

  ${media.mobile} {
    padding: 1.5rem 0.5rem; /* Adjust padding for mobiles */
  }

  ${media.mobileSmall} {
    padding: 1rem 0.25rem; /* Adjust padding for 360px width */
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 2rem;

  ${media.mobile} {
    gap: 1.5rem; /* Adjust gap for mobiles */
  }

  ${media.mobileSmall} {
    gap: 1rem; /* Adjust gap for 360px width */
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem; /* Add gap for responsiveness */

  ${media.mobile} {
    flex-direction: column; /* Stack items vertically on mobile */
    align-items: flex-start;
  }
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

  ${media.mobile} {
    font-size: 0.8rem; /* Adjust font size for mobile */
    gap: 1rem;
    .dot {
      width: 10px;
      height: 10px;
    }
  }

  ${media.mobileSmall} {
    font-size: 0.75rem; /* Adjust font size for 360px width */
    gap: 0.8rem;
  }
`;

const DoctorSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  ${media.mobile} {
    width: 100%; /* Use full width on mobile */
    justify-content: flex-start; /* Align to start on mobile */
  }
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

  ${media.mobile} {
    padding: 0.4rem 0.7rem; /* Adjust padding for mobile */
    font-size: 0.8rem; /* Adjust font size for mobile */
  }

  ${media.mobileSmall} {
    padding: 0.3rem 0.6rem; /* Adjust padding for 360px width */
    font-size: 0.75rem; /* Adjust font size for 360px width */
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
    color: white;
  }

  /* React Calendar Specific Adjustments */
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
      min-height: 80px; /* Adjust tile height for tablets */
      padding: 0.6rem 0.4rem;
    }
    .calendar-event {
      font-size: 0.65rem; /* Adjust font size for tablets */
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
      min-height: 60px; /* Adjust tile height for mobiles */
      padding: 0.5rem 0.3rem;
    }
    .calendar-event {
      font-size: 0.6rem; /* Adjust font size for mobiles */
      padding: 2px 4px;
      margin-top: 1px;
    }
    .react-calendar__navigation button {
      font-size: 0.8rem; /* Adjust navigation button font size */
    }
    .react-calendar__month-view__weekdays__weekday {
      font-size: 0.7rem; /* Adjust weekday font size */
    }
    .react-calendar__tile abbr {
      font-size: 0.8rem; /* Adjust date number font size */
    }
  }

  ${media.mobileSmall} {
    .react-calendar {
      padding: 0.4rem;
    }
    .react-calendar__tile {
      min-height: 50px; /* Adjust tile height for 360px width */
      padding: 0.4rem 0.2rem;
    }
    .calendar-event {
      font-size: 0.55rem; /* Adjust font size for 360px width */
      padding: 1px 3px;
    }
    .react-calendar__navigation button {
      font-size: 0.7rem; /* Adjust navigation button font size for 360px width */
    }
    .react-calendar__month-view__weekdays__weekday {
      font-size: 0.65rem; /* Adjust weekday font size for 360px width */
    }
    .react-calendar__tile abbr {
      font-size: 0.75rem; /* Adjust date number font size for 360px width */
    }
    .calendar-day-wrapper > div:last-child {
      font-size: 0.6rem !important; /* Adjust "see more" text size */
    }
  }
`;

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

  ${media.mobile} {
    padding: 0.8rem; /* Adjust padding for mobile */
    margin-bottom: 0.6rem;
    border-left-width: 4px; /* Adjust border thickness for mobile */
    font-size: 0.9rem; /* Adjust font size for mobile */
  }

  ${media.mobileSmall} {
    padding: 0.6rem; /* Adjust padding for 360px width */
    margin-bottom: 0.5rem;
    font-size: 0.85rem; /* Adjust font size for 360px width */
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
    max-width: 95%; /* Use wider width on mobile */
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
    gap: 0.5rem;
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
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  ${media.mobileSmall} {
    font-size: 1.2rem;
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
  column-gap: 5rem;

  ${media.tablet} {
    grid-template-columns: 100px 1fr; /* Adjust column width for tablets */
    column-gap: 2rem;
  }

  ${media.mobile} {
    grid-template-columns: 80px 1fr; /* Adjust column width for mobile */
    row-gap: 0.8rem;
    column-gap: 1rem;
  }

  ${media.mobileSmall} {
    grid-template-columns: 70px 1fr; /* Adjust column width for 360px width */
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

  ${media.mobile} {
    font-size: 0.95rem;
  }

  ${media.mobileSmall} {
    font-size: 0.9rem;
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
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);

  useEffect(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth() + 1;
    const fetchData = async () => {
      const res = await getHospitalCalendar(year, month);
      setFullList(res.calendarItemLists);
      // Ensure unique doctor names
      const uniqueDoctorNames = [...new Set(res.calendarItemLists.map((d: any) => d.name))];
      setDoctorNames(uniqueDoctorNames);
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

  const openFullList = (dateStr: string) => {
    const items = calendarData[dateStr] || [];
    setModalItems(items);
    setModalDate(dateStr);
    setModalOpen(true);
  };

  const handleAppointmentClick = async (item: any) => {
    try {
      const detail = await getAppointmentDetail(item.relatedId);
      setAppointmentDetail(detail);
      setItemDetailOpen(true);
    } catch (error) {
      console.error('예약 상세 조회 실패:', error);
    }
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    // 대한민국 표준시(KST) UTC+9를 고려한 날짜 문자열 변환
    const kstOffset = 9 * 60; // 9 hours in minutes
    const localDate = new Date(date.getTime() + (date.getTimezoneOffset() + kstOffset) * 60 * 1000);
    const dateStr = localDate.toISOString().split('T')[0];
    const items = calendarData[dateStr];
    if (!items) return null;

    // Helper function to check if the current viewport is mobile
    // We'll use the 'mobile' breakpoint defined in 'sizes'
    const isMobile = () => {
      return window.innerWidth <= parseInt(sizes.mobile, 10);
    };

    return (
      <div className="calendar-day-wrapper" onClick={() => openFullList(dateStr)}>
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="calendar-event"
            onClick={(e) => {
              e.stopPropagation(); // prevent date select
              openFullList(dateStr);
            }}
          >
            {isMobile() // Conditionally render "진료" or full text based on isMobile()
              ? '진료'
              : `🏥 ${item.name} - ${item.title}`}
          </div>
        ))}
        {items.length > 3 && (
          <div style={{ fontSize: '0.7rem', color: '#888' }}>+{items.length - 3}개 더보기</div>
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
            locale="en-US" // Change to 'ko-KR' for Korean locale
            value={selectedDate}
            onChange={(d) => d instanceof Date && setSelectedDate(d)}
            tileContent={renderTileContent}
            onActiveStartDateChange={({ activeStartDate }) =>
              activeStartDate && setActiveDate(activeStartDate)
            }
          />
        </CalendarWrapper>
      </ContentBox>

      {modalOpen && (
        <CommonModal
          title={`${modalDate} 진료 전체보기`}
          buttonText="닫기"
          onClose={() => setModalOpen(false)}
        >
          <StyledList>
            {modalItems.map((item, idx) => (
              <StyledItem key={idx} onClick={() => handleAppointmentClick(item)}>
                🏥 {item.name} - {item.title} ({item.time})
              </StyledItem>
            ))}
          </StyledList>
        </CommonModal>
      )}

      {itemDetailOpen && appointmentDetail && (
        <CommonModal
          title={null} // Set title to null for custom content mode
          buttonText="" // Set buttonText to empty string for custom content mode
          onClose={() => {
            setItemDetailOpen(false);
            setAppointmentDetail(null);
          }}
        >
          {/* CloseIcon is now handled by CommonModal, no need to add here directly unless it's a very specific custom layout */}
          <DetailContainer>
            <HeaderSection>
              <HeaderIcon>🏥</HeaderIcon>
              <HeaderTitle>{appointmentDetail.appointmentTime.split('T')[0]} 예약 상세</HeaderTitle>
            </HeaderSection>

            <InfoGrid>
              <Label>환자</Label>
              <Value>{appointmentDetail.patientName}</Value>

              <Label>날짜</Label>
              <Value>{appointmentDetail.appointmentTime.split('T')[0]}</Value>

              <Label>시간</Label>
              <Value>{appointmentDetail.appointmentTime.split('T')[1]}</Value>

              <Label>증상</Label>
              <Value>{appointmentDetail.symptom}</Value>

              <Label>질문</Label>
              <Value>{appointmentDetail.question}</Value>
            </InfoGrid>
          </DetailContainer>
        </CommonModal>
      )}
    </PageContainer>
  );
}
