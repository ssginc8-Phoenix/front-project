import styled from 'styled-components';
import PatientCalendar from '~/features/calendar/components/PatientCalendar';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo } from '~/features/patient/api/userAPI';
import type { User } from '~/types/user';
import { useEffect, useState } from 'react';
import Sidebar from '~/common/Sidebar';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8;
  font-family: 'Segoe UI', sans-serif;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const PatientCalendarPage = () => {
  const { user, fetchMyInfo } = useLoginStore();
  const [userinfo, setUserinfo] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      await fetchMyInfo();
      const info = await getUserInfo();
      setUserinfo(info);
    })();
  }, [fetchMyInfo]);

  return (
    <PageWrapper>
      <Sidebar />

      <ContentWrapper>
        <PatientCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PatientCalendarPage;
