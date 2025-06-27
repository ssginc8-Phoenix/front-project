import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { getAppointmentDetail, getDoctorCalendar } from '~/features/calendar/api/CalendarAPI';
import CommonModal from '~/components/common/CommonModal';

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
  background-color: #f5f7fa;
  min-height: 100vh;

  ${media.tablet} {
    padding: 2rem 1rem;
  }

  ${media.mobile} {
    padding: 1.5rem 0.5rem;
  }

  ${media.mobileSmall} {
    padding: 1rem 0.25rem;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 2rem;

  ${media.mobile} {
    gap: 1.5rem;
  }

  ${media.mobileSmall} {
    gap: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Added for responsiveness */
  gap: 1rem; /* Added for responsiveness */

  ${media.mobile} {
    flex-direction: column;
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
    font-size: 0.8rem;
    gap: 1rem;
    .dot {
      width: 10px;
      height: 10px;
    }
  }

  ${media.mobileSmall} {
    font-size: 0.75rem;
    gap: 0.8rem;
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

/* Modal list styling (보호자 캘린더와 통일) */
const StyledList = styled.ul`
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
    padding: 0.8rem;
    margin-bottom: 0.6rem;
    border-left-width: 4px;
  }

  ${media.mobileSmall} {
    padding: 0.6rem;
    margin-bottom: 0.5rem;
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
    max-width: 95%;
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
    grid-template-columns: 100px 1fr;
    column-gap: 2rem;
  }

  ${media.mobile} {
    grid-template-columns: 80px 1fr;
    row-gap: 0.8rem;
    column-gap: 1rem;
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
  text-align: center; /* Changed from center to right for better alignment */

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

/* ----------------------------- 컴포넌트 ----------------------------- */
export default function DoctorCalendar() {
  const [calendarData, setCalendarData] = useState<Record<string, any[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [isMobile, setIsMobile] = useState(false); // New state to track mobile status

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

  // Effect to update isMobile state on resize
  useEffect(() => {
    const checkMobile = () => {
      // Use the actual 'mobile' breakpoint value from `sizes`
      setIsMobile(window.innerWidth <= parseInt(sizes.mobile, 10));
    };

    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile); // Add resize listener

    return () => window.removeEventListener('resize', checkMobile); // Cleanup
  }, []);

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
            {isMobile // Conditionally render "진료" or full text based on isMobile state
              ? '진료'
              : `🏥${item.title}`}
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
        <CommonModal title={null} buttonText="" onClose={() => setDetailOpen(false)}>
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
