import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import useLoginStore from '~/features/user/stores/LoginStore';

// API 임포트
import { getGuardianCalendar } from '~/features/calendar/api/CalendarAPI'; // Guardian Calendar API
import { getMedicationSchedule } from '~/features/medication/api/medicationAPI'; // 약 상세 정보
import type { User } from '~/types/user';
import { getUserInfo } from '~/features/patient/api/userAPI';
import { getGuardianPatients } from '~/features/guardian/api/guardianAPI'; // 연결된 환자 목록 API

// --- 대시보드 아이템 (기존과 동일)
const dashboardItems = [
  { label: '환자 관리', icon: '👵️', key: 'patients' },
  { label: '캘린더', icon: '🗓️', key: 'calendar' },
  { label: '정보 관리', icon: '⚙️', key: 'info' },
  { label: 'Q&A', icon: '💬', key: 'qna' },
  { label: '리뷰 관리', icon: '📝', key: 'review' },
  { label: '예약 관리', icon: '📋', key: 'reservation' },
];

// === 환자 타입 정의 (GuardianAPI.ts의 PatientSummary를 확장) ===
export interface PatientSummary {
  patientId: number; // getGuardianPatients가 반환하는 환자의 실제 ID
  name: string;
  residentRegistrationNumber: string;
  profileImageUrl?: string;
  patientGuardianId?: number; // 캘린더 API에서 환자 ID로 사용되는 ID (여기서 추가할 필드)
}

// === 새로 추가될 복약 정보 포함된 환자 타입 ===
interface PatientWithMedicationDetail extends PatientSummary {
  medicationsToday: {
    // 오늘 복용해야 할 약 상세 목록
    medicationName: string;
    time: string; // HH:MM
    meal?: 'morning' | 'lunch' | 'dinner' | 'ETC'; // API 응답에 맞춰 영어로 유지 (변환은 렌더링 시)
  }[];
}

// CalendarItem 인터페이스 (새로운 API 응답 구조에 맞게 수정)
export interface GuardianCalendarItem {
  date: string; //YYYY-MM-DD
  itemType: 'MEDICATION' | 'APPOINTMENT';
  title: string;
  description?: string;
  time?: string; // HH:MM:SS (캘린더 항목 자체의 시간)
  relatedId?: number; // MEDICATION 상세조회용 ID (MedicationId)
  hospitalName?: string;
}

// Guardian Calendar API 응답에서 각 환자별 캘린더 리스트를 나타내는 인터페이스
interface PatientCalendarList {
  name: string; // 환자 이름
  patientGuardianId: number; // 이것이 곧 캘린더 API에서 환자 ID로 사용될 수 있음
  calendarItems: GuardianCalendarItem[]; // 해당 환자의 캘린더 아이템 배열
}

// 다음 진료 예약을 표시하기 위한 확장된 인터페이스
interface NextAppointmentDisplay extends GuardianCalendarItem {
  patientName: string;
  patientId: number;
}

// --- 스타일 정의 (이전과 동일하게 유지) ---
const Main = styled.main`
  min-height: 100vh;
  background-color: transparent;
  font-family: 'Segoe UI', sans-serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const MyPageHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00499e;
  margin-top: 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const MainContentWrapper = styled.section`
  flex: 1;
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: none;
  margin-top: 0;
  margin-bottom: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const SummaryCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
`;

const SummaryCard = styled.div`
  background: #f8fcff;
  border: 1px solid #e0f0ff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 180px;

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

const DashboardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  padding-top: 2rem;
  border-top: 1px dashed #e0e0e0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const DashboardButton = styled.button`
  background: #fafbfc;
  border: none;
  border-radius: 15px;
  padding: 30px 0 20px 0;
  box-shadow: none;
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
    box-shadow: none;
  }

  & span {
    font-size: 3rem;
    margin-bottom: 15px;
  }
`;

const CenterSection = styled.section`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const CenterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  background-color: #eaf1fe;
  color: #2261bb;
  font-weight: 700;
  border-radius: 26px;
  border: none;
  font-size: 1.18rem;
  box-shadow: none;
  cursor: pointer;
  transition:
    background 0.15s,
    box-shadow 0.15s;

  &:hover {
    background-color: #dbe8fb;
    box-shadow: none;
  }
`;

// --- 컴포넌트
export const GuardianMyPage = () => {
  const navigate = useNavigate();
  const { user, fetchMyInfo } = useLoginStore();
  const [userinfo, setUserinfo] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [connectedPatients, setConnectedPatients] = useState<PatientSummary[]>([]);
  const [nextPatientAppointment, setNextPatientAppointment] =
    useState<NextAppointmentDisplay | null>(null);
  const [todayPatientsWithMedication, setTodayPatientsWithMedication] = useState<
    PatientWithMedicationDetail[]
  >([]);

  // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 헬퍼 함수
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // meal 타입을 한글로 변환하는 헬퍼 함수
  const getMealDisplayName = (mealType?: 'morning' | 'lunch' | 'dinner' | 'ETC') => {
    switch (mealType) {
      case 'morning':
        return '아침';
      case 'lunch':
        return '점심';
      case 'dinner':
        return '저녁';
      case 'ETC':
        return '기타';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMyInfo();
      const userInfoData = await getUserInfo();
      setUserinfo(userInfoData);

      const currentKST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      const todayStr = getLocalDateString(currentKST);

      try {
        const patientsListFromApi = await getGuardianPatients();

        const guardianCalendarData = await getGuardianCalendar(
          currentKST.getFullYear(),
          currentKST.getMonth() + 1,
        );

        const patientCalendarLists: PatientCalendarList[] =
          guardianCalendarData.calendarItemLists || [];

        // --- patientId와 patientGuardianId를 매핑합니다. ---
        const nameToPatientGuardianIdMap = new Map<string, number>();
        patientCalendarLists.forEach((calPatient) => {
          nameToPatientGuardianIdMap.set(calPatient.name, calPatient.patientGuardianId);
        });

        const enrichedPatientsList: PatientSummary[] = patientsListFromApi
          .map((p) => ({
            ...p,
            patientGuardianId: nameToPatientGuardianIdMap.get(p.name),
          }))
          .filter((p) => p.patientGuardianId !== undefined);

        setConnectedPatients(enrichedPatientsList);

        let overallNextAppointment: NextAppointmentDisplay | null = null;
        const patientsMedicationDetailMap = new Map<
          number,
          PatientWithMedicationDetail['medicationsToday']
        >();

        for (const patientList of patientCalendarLists) {
          const patientName = patientList.name;
          const patientGuardianIdFromCalendar = patientList.patientGuardianId;

          for (const item of patientList.calendarItems) {
            if (!item.itemType) {
              console.warn(
                `[DEBUG] Calendar item for ${patientName} on ${item.date} is missing 'itemType'. Skipping:`,
                item,
              );
              continue;
            }

            // 다음 진료 예약 찾기
            if (item.itemType === 'APPOINTMENT') {
              const appointmentDateTime = new Date(item.date + 'T' + (item.time || '00:00:00'));

              if (appointmentDateTime >= currentKST) {
                if (
                  !overallNextAppointment ||
                  appointmentDateTime <
                    new Date(
                      overallNextAppointment.date +
                        'T' +
                        (overallNextAppointment.time || '00:00:00'),
                    )
                ) {
                  overallNextAppointment = {
                    ...item,
                    patientName: patientName,
                    patientId: patientGuardianIdFromCalendar,
                  };
                }
              }
            }

            // 오늘 복약 필요한 환자 및 상세 정보 취합
            if (
              item.itemType === 'MEDICATION' &&
              getLocalDateString(new Date(item.date)) === todayStr
            ) {
              if (item.relatedId) {
                try {
                  const detail = await getMedicationSchedule(item.relatedId);

                  if (detail.times && detail.times.length > 0) {
                    const currentMedications =
                      patientsMedicationDetailMap.get(patientGuardianIdFromCalendar) || [];

                    detail.times.forEach((medTime) => {
                      const [hour, minute] = medTime.time.split(':').map(Number);
                      const medicationDateTime = new Date(
                        currentKST.getFullYear(),
                        currentKST.getMonth(),
                        currentKST.getDate(),
                        hour,
                        minute,
                      );

                      if (medicationDateTime >= currentKST) {
                        currentMedications.push({
                          medicationName: detail.medicationName,
                          time: medTime.time.slice(0, 5),
                          meal: medTime.meal,
                        });
                      }
                    });

                    currentMedications.sort((a, b) => a.time.localeCompare(b.time));

                    patientsMedicationDetailMap.set(
                      patientGuardianIdFromCalendar,
                      currentMedications,
                    );
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            }
          }
        }

        setNextPatientAppointment(overallNextAppointment);

        const finalTodayPatientsWithMedication: PatientWithMedicationDetail[] = enrichedPatientsList
          .filter((p) => patientsMedicationDetailMap.has(p.patientGuardianId!))
          .map((p) => ({
            ...p,
            medicationsToday: patientsMedicationDetailMap.get(p.patientGuardianId!) || [],
          }));

        setTodayPatientsWithMedication(finalTodayPatientsWithMedication);
      } catch (error) {
        setNextPatientAppointment(null);
        setTodayPatientsWithMedication([]);
      }
    };

    fetchData();
  }, [fetchMyInfo]);

  const handleDashboardClick = (key: string) => {
    if (key === 'info') {
      setShowPasswordModal(true);
    } else {
      if (key === 'calendar') {
        navigate('/guardians/calendar');
      } else {
        navigate(`/guardians/${key}`);
      }
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    navigate('/guardians/info');
  };

  // const firstConnectedPatient = connectedPatients.length > 0 ? connectedPatients[0] : null; // 이제 더 이상 필요하지 않습니다.

  return (
    <>
      <Main>
        <WelcomeSection>
          <ProfileImage
            src={
              userinfo?.profileImageUrl ??
              'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
            }
            alt="프로필 사진"
          />
          <MyPageHeader>{user?.name ?? '이름 로딩 중'} 님, 환영합니다! 👋</MyPageHeader>
        </WelcomeSection>

        <MainContentWrapper>
          <SummaryCardGrid>
            <SummaryCard>
              <h3>🏥 다음 환자 진료 예약</h3>
              {nextPatientAppointment ? (
                <>
                  <p>
                    <span className="highlight">
                      {nextPatientAppointment.patientName} 환자 (
                      {new Date(nextPatientAppointment.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                      {nextPatientAppointment.time
                        ? ` ${nextPatientAppointment.time.slice(0, 5)}`
                        : ''}
                      )
                    </span>
                  </p>
                  <p>{nextPatientAppointment.hospitalName || '병원 정보 없음'}</p>
                  <p>
                    <span className="highlight">{nextPatientAppointment.title}</span>
                  </p>
                </>
              ) : (
                <p>예정된 환자 진료 예약이 없습니다.</p>
              )}
            </SummaryCard>
            <SummaryCard>
              <h3>💊 오늘 복약 관리 환자</h3>
              {todayPatientsWithMedication.length > 0 ? (
                <>
                  <p>
                    오늘 복약 관리가 필요한 환자는 총{' '}
                    <span className="highlight">{todayPatientsWithMedication.length}명</span>{' '}
                    입니다.
                  </p>
                  <ul>
                    {todayPatientsWithMedication.map((patientWithMeds) => (
                      <li key={patientWithMeds.patientId}>
                        <span className="highlight">{patientWithMeds.name}</span>:
                        <ul>
                          {patientWithMeds.medicationsToday.map((med, medIndex) => (
                            <li key={medIndex} style={{ marginLeft: '15px' }}>
                              {med.time} - {med.medicationName}
                              {med.meal && ` (${getMealDisplayName(med.meal)})`}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>오늘 복약 관리가 필요한 환자가 없습니다.</p>
              )}
            </SummaryCard>
            <SummaryCard>
              <h3>🧑‍🤝‍🧑 연결된 환자</h3>
              {connectedPatients.length > 0 ? (
                <>
                  <p>
                    현재 <span className="highlight">{connectedPatients.length}명</span>의 환자가
                    연결되어 있습니다.
                  </p>
                  {/* 변경된 부분: 첫 번째 환자 대신 전체 목록 표시 */}
                  <ul>
                    {connectedPatients.map((patient) => (
                      <li key={patient.patientId}>
                        <span className="highlight">{patient.name}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>연결된 환자가 없습니다.</p>
              )}
            </SummaryCard>
          </SummaryCardGrid>

          <DashboardSection>
            <DashboardGrid>
              {dashboardItems.map((item) => (
                <DashboardButton key={item.key} onClick={() => handleDashboardClick(item.key)}>
                  <span>{item.icon}</span>
                  {item.label}
                </DashboardButton>
              ))}
            </DashboardGrid>
          </DashboardSection>
        </MainContentWrapper>

        <PasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordSuccess}
        />
      </Main>
    </>
  );
};

export default GuardianMyPage;
