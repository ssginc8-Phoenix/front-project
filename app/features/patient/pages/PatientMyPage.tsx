import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import useLoginStore from '~/features/user/stores/LoginStore';
import type { User } from '~/types/user';
import { getUserInfo } from '~/features/patient/api/userAPI';
// SidebarMenu는 이제 사용하지 않으므로 제거합니다.
// import SidebarMenu from '~/features/patient/components/SidebarMenu';

// PatientCalendar.tsx에서 가져온 타입과 API를 활용
import { getPatientCalendar } from '~/features/calendar/api/CalendarAPI';
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI';

// GuardianPage.tsx에서 가져온 API 및 타입 활용
import { getGuardians, getPatientInfo } from '~/features/patient/api/patientAPI';

// patientSidebarItems는 버튼을 렌더링하는 데 계속 사용하므로 유지합니다.
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';

// === Guardian 타입에 responded_at 추가 ===
interface Guardian {
  patientGuardianId: number;
  name: string;
  relationship?: string; // 관계 필드가 있다면 계속 사용
  responded_at?: string; // 초대 수락 일시
}

// CalendarItem 인터페이스 복사 (PatientCalendar.tsx에서 가져옴)
interface CalendarItem {
  date: string;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  times?: { meal: 'morning' | 'lunch' | 'dinner' | 'ETC'; time: string }[];
  relatedId?: number; // MEDICATION 상세조회용 ID
  // APPOINTMENT의 경우 추가될 수 있는 필드
  hospitalName?: string;
  appointmentItemTime?: string;
}

// 오늘 복용할 약 리스트에 사용할 인터페이스
interface TodayMedication {
  time: string; // "HH:MM" 형식
  name: string; // 약 이름
  meal?: 'morning' | 'lunch' | 'dinner' | 'ETC'; // 식사 관련 정보 (선택적)
}

// --- 스타일 정의 ---
// PageWrapper: 전체 페이지 배경색 제거 및 내부 콘텐츠 중앙 정렬
const PageWrapper = styled.div`
  min-height: 100vh;
  /* background-color: #f0f4f8; */ /* 배경색 제거 */
  background-color: transparent; /* 배경색을 투명으로 설정 */
  font-family: 'Segoe UI', sans-serif;
  padding: 2rem; /* 전체 페이지 여백 유지 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 전체 콘텐츠 중앙 정렬 */
`;

// New styled component to group ProfileSection and MyPageHeader
const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem; /* 하단 콘텐츠와의 간격 */
  /* 배경색, 그림자 제거 */
`;

// ProfileSection: 배경색 및 그림자 제거, WelcomeSection 안으로 통합되면서 마진 조정
const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem; /* 환영 메시지와의 간격 */
  /* background-color: #ffffff; */ /* 배경색 제거 */
  /* padding: 1.5rem; */ /* 패딩 제거 */
  /* border-radius: 16px; */ /* 테두리 둥글게 제거 */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); */ /* 그림자 제거 */
  /* max-width: 300px; */ /* 너비 제한 제거 (WelcomeSection이 관리) */
  /* margin: 0 auto 2rem auto; */ /* 마진 조정 */
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
`;
const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
`;

// MainContentWrapper: 중앙 정렬은 PageWrapper가 담당, 자체 마진 조정
const MainContentWrapper = styled.section`
  flex: 1; /* 남아있는 공간 모두 사용 */
  padding: 2rem 4rem; /* 좌우 여백을 더 넓게 */
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 0; /* ProfileSection과 붙도록 마진 제거 */
  margin-bottom: 2rem;
  max-width: 1200px; /* 전체 페이지 콘텐츠의 최대 너비 제한 */
  width: 100%; /* 너비를 100%로 설정하여 부모의 max-width를 따르도록 */
`;

const MyPageHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00499e;
  margin-top: 0; /* 프로필 섹션과 붙도록 마진 제거 */
  margin-bottom: 3rem;
  text-align: center; /* 헤더 중앙 정렬 */
`;

const SummaryCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* 3개까지 가로로 나란히 */
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center; /* 카드들을 중앙으로 정렬 */
`;

const SummaryCard = styled.div`
  background: #f8fcff;
  border: 1px solid #e0f0ff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 180px; /* 카드 최소 높이 설정 */

  h3 {
    font-size: 1.3rem;
    color: #1a5da2;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  p {
    font-size: 1rem;
    color: #555;
    line-height: 1.4;
  }
  .highlight {
    font-weight: bold;
    color: #00499e;
    font-size: 1.1rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
    color: #333;
  }
`;

const MyPageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개씩 가로로 나열 */
  gap: 2rem;
  width: 100%;
  max-width: 900px; /* 3개 버튼이 적절하게 보이도록 최대 너비 조정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding-top: 2rem;
  border-top: 1px dashed #e0e0e0;

  @media (max-width: 992px) {
    /* 태블릿 크기에서 2개씩 */
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    /* 모바일 크기에서 1개씩 */
    grid-template-columns: repeat(1, 1fr);
  }
`;

const MyPageButton = styled.button`
  background: #fafbfc;
  border: none;
  border-radius: 15px;
  padding: 30px 0 20px 0;
  box-shadow: 0 4px 15px 0 rgba(34, 97, 187, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  transition:
    background 0.16s,
    box-shadow 0.16s;
  outline: none;
  min-width: 150px;

  &:hover {
    background: #e0edff;
    box-shadow: 0 6px 20px 0 rgba(34, 97, 187, 0.15);
  }

  & span {
    font-size: 3rem;
    margin-bottom: 15px;
  }
`;

// --- 컴포넌트
export const PatientMyPage = () => {
  const navigate = useNavigate();
  const { user, fetchMyInfo } = useLoginStore();
  const [userinfo, setUserinfo] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [todayMedications, setTodayMedications] = useState<TodayMedication[]>([]);
  const [nextAppointment, setNextAppointment] = useState<CalendarItem | null>(null);
  const [connectedGuardians, setConnectedGuardians] = useState<Guardian[]>([]);

  // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 헬퍼 함수
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMyInfo();
      const userInfoData = await getUserInfo();
      setUserinfo(userInfoData);

      const today = new Date();
      const currentKST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      const todayStr = getLocalDateString(currentKST);

      try {
        // 1. 캘린더 데이터 (약, 예약) 가져오기
        const calendarRes = await getPatientCalendar(
          currentKST.getFullYear(),
          currentKST.getMonth() + 1,
        );

        let medsForToday: TodayMedication[] = [];
        let upcomingAppointments: CalendarItem[] = [];

        for (const item of calendarRes.calendarItems) {
          const itemDate = new Date(item.date);
          const itemDateStr = getLocalDateString(itemDate);

          // 오늘 복용할 약 필터링
          if (item.itemType === 'MEDICATION' && itemDateStr === todayStr) {
            if (item.relatedId) {
              try {
                const detail = await getMedicationSchedule(item.relatedId);
                detail.times?.forEach((medTime) => {
                  const [hour, minute] = medTime.time.split(':').map(Number);
                  const medicationDateTime = new Date(
                    currentKST.getFullYear(),
                    currentKST.getMonth(),
                    currentKST.getDate(),
                    hour,
                    minute,
                  );

                  if (medicationDateTime >= currentKST) {
                    medsForToday.push({
                      time: medTime.time.slice(0, 5),
                      name: detail.medicationName,
                      meal: medTime.meal,
                    });
                  }
                });
              } catch (detailError) {
                console.error(`약 ${item.relatedId} 상세 정보 로딩 실패:`, detailError);
              }
            }
          }

          // 다음 진료 예약 필터링 (현재 시간 이후의 예약만)
          if (item.itemType === 'APPOINTMENT') {
            const appointmentDateTime = new Date(
              item.date + 'T' + (item.appointmentItemTime || '00:00') + ':00',
            );
            if (appointmentDateTime >= currentKST) {
              upcomingAppointments.push(item);
            }
          }
        }

        medsForToday.sort((a, b) => a.time.localeCompare(b.time));
        setTodayMedications(medsForToday);

        upcomingAppointments.sort((a, b) => {
          const dateA = new Date(a.date + 'T' + (a.appointmentItemTime || '00:00') + ':00');
          const dateB = new Date(b.date + 'T' + (b.appointmentItemTime || '00:00') + ':00');
          return dateA.getTime() - dateB.getTime();
        });
        setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);

        // 2. 보호자 정보 가져오기 및 'responded_at' 기준으로 정렬
        const patientInfoData = await getPatientInfo();
        if (patientInfoData?.patientId) {
          const guardianList = await getGuardians(patientInfoData.patientId);
          const sortedGuardians = guardianList.sort((a, b) => {
            const dateA = a.responded_at ? new Date(a.responded_at).getTime() : 0;
            const dateB = b.responded_at ? new Date(b.responded_at).getTime() : 0;
            return dateB - dateA; // 내림차순 정렬 (가장 최근 수락된 것이 먼저 오도록)
          });
          setConnectedGuardians(sortedGuardians);
        }
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchData();
  }, [fetchMyInfo]);

  const handleSidebarChange = (key: string) => {
    // 마이페이지 버튼 클릭 시 스크롤만 상단으로
    if (key === 'mypage') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // 정보 관리 클릭 시 비밀번호 모달
    if (key === 'info') {
      setShowPasswordModal(true);
    } else {
      navigate(`/patients/${key}`); // 그 외 페이지로 이동
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    navigate('/patients/info');
  };

  const mostRecentlyConnectedGuardian =
    connectedGuardians.length > 0 ? connectedGuardians[0] : null;

  return (
    <>
      <PageWrapper>
        {/* 프로필 섹션과 환영 메시지를 WelcomeSection으로 묶어 배치 */}
        <WelcomeSection>
          <ProfileSection>
            {userinfo?.profileImageUrl ? (
              <ProfileImage src={userinfo.profileImageUrl} alt="프로필 이미지" />
            ) : (
              <ProfileImage
                src="https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png"
                alt="기본 프로필"
              />
            )}
            <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
            <ProfileRole>환자</ProfileRole>
          </ProfileSection>
          <MyPageHeader>{user?.name ?? '이름 로딩 중'} 님, 환영합니다! 👋</MyPageHeader>
        </WelcomeSection>

        <MainContentWrapper>
          <SummaryCardGrid>
            <SummaryCard>
              <h3>🏥 다음 진료 예약</h3>
              {nextAppointment ? (
                <>
                  <p>
                    <span className="highlight">
                      {new Date(nextAppointment.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                      {nextAppointment.appointmentItemTime
                        ? ` ${nextAppointment.appointmentItemTime.slice(0, 5)}`
                        : ''}
                    </span>
                  </p>
                  <p>{nextAppointment.hospitalName || '병원 정보 없음'}</p>
                  <p>
                    <span className="highlight">{nextAppointment.title}</span>
                  </p>
                </>
              ) : (
                <p>예정된 진료 예약이 없습니다.</p>
              )}
            </SummaryCard>
            <SummaryCard>
              <h3>💊 오늘 복용할 약</h3>
              {todayMedications.length > 0 ? (
                <ul>
                  {todayMedications.map((med, index) => (
                    <li key={index}>
                      {med.time} : <span className="highlight">{med.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>오늘 복용할 약이 없습니다. 건강한 하루 되세요!</p>
              )}
            </SummaryCard>
            <SummaryCard>
              <h3>🧑‍🤝‍🧑 연결된 보호자</h3>
              {connectedGuardians.length > 0 ? (
                <>
                  <p>
                    현재 <span className="highlight">{connectedGuardians.length}명</span>의 보호자가
                    연결되어 있습니다.
                  </p>
                  {mostRecentlyConnectedGuardian ? (
                    <p>
                      최근 연결:{' '}
                      <span className="highlight">
                        {mostRecentlyConnectedGuardian.name}
                        {mostRecentlyConnectedGuardian.relationship
                          ? ` (${mostRecentlyConnectedGuardian.relationship})`
                          : ''}
                      </span>
                    </p>
                  ) : (
                    <p>최근 연결 보호자 정보를 불러올 수 없습니다.</p>
                  )}
                </>
              ) : (
                <p>연결된 보호자가 없습니다.</p>
              )}
            </SummaryCard>
          </SummaryCardGrid>

          <MyPageGrid>
            {patientSidebarItems
              .filter((item) => item.key !== 'mypage') // 마이페이지 버튼은 MyPageGrid에서 제외
              .map((item) => (
                <MyPageButton key={item.key} onClick={() => handleSidebarChange(item.key)}>
                  <span>{item.icon}</span>
                  {item.label}
                </MyPageButton>
              ))}
          </MyPageGrid>
        </MainContentWrapper>
      </PageWrapper>

      <PasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
};

export default PatientMyPage;
