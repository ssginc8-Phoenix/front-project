// src/features/guardian/pages/GuardianInfoPage.tsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SidebarMenu from '~/features/guardian/components/SidebarMenu'; // Patient SidebarMenu 사용 (스타일 통일)
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo, updateUserInfo } from '~/features/patient/api/userAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';
import ReusableModal from '~/features/patient/components/ReusableModal'; // ReusableModal 경로 통일
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import { guardianSidebarItems } from '~/constants/sidebarItems';

// 전화번호 3-4-4 포맷 함수 추가 (필요시)
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 7);
  const part3 = digits.slice(7, 11);
  if (digits.length > 7) return `${part1}-${part2}-${part3}`;
  if (digits.length > 3) return `${part1}-${part2}`;
  return part1;
};

// PageBg를 PageWrapper로 변경하고 CalendarPage 스타일과 통일
const PageWrapper = styled.div`
  display: flex; /* CalendarPage와 동일 */
  min-height: 100vh; /* CalendarPage와 동일 */
  background-color: #f0f4f8; /* CalendarPage와 동일 */
  font-family: 'Segoe UI', sans-serif; /* CalendarPage와 동일 */
  /* max-width, margin, padding-top 제거. flex 컨테이너 역할만 */
`;

// FlexRow 제거 (PageWrapper가 flex 컨테이너 역할)

// SidebarBox 스타일 CalendarPage와 통일
const SidebarBox = styled.div`
  width: 260px; /* CalendarPage와 동일한 너비 */
  background: white;
  border-right: 1px solid #e0e0e0; /* CalendarPage와 동일한 border */
  padding: 2rem 1rem; /* CalendarPage와 동일한 패딩 */
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 20px 20px 0; /* CalendarPage와 동일한 border-radius */
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05); /* CalendarPage와 동일한 box-shadow */
  flex-shrink: 0; /* CalendarPage와 동일 */
  /* margin-right 제거 */
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem; /* CalendarPage와 동일 */
`;

const ProfileImage = styled.img`
  width: 80px; /* CalendarPage와 동일 */
  height: 80px; /* CalendarPage와 동일 */
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: bold; /* CalendarPage와 동일 */
  font-size: 1.3rem; /* CalendarPage와 동일 */
  color: #333; /* CalendarPage와 유사 */
`;

const ProfileRole = styled.div`
  color: #777; /* CalendarPage와 동일 */
  font-size: 1rem;
`;

// MainSection 스타일 CalendarPage의 ContentWrapper 또는 PatientInfoPage의 MainSection과 통일
const MainSection = styled.section`
  flex: 1;
  padding: 2rem; /* CalendarPage의 ContentWrapper와 동일 */
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 900px; /* PatientInfoPage에서 늘린 너비와 통일 */
  margin-left: 48px; /* 사이드바와의 간격 통일 */
`;

const GuardianInfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem; /* PatientInfoPage와 통일 */
  font-size: 2.2rem; /* PatientInfoPage와 통일 */
  font-weight: 700; /* PatientInfoPage와 통일 */
  color: #00499e; /* PatientInfoPage와 통일 */
`;

// const ProfileInfo = styled.img`
//   width: 2.5rem; /* PatientInfoPage의 MainHeaderProfileImage와 통일 */
//   height: 2.5rem; /* PatientInfoPage의 MainHeaderProfileImage와 통일 */
//   border-radius: 50%;
//   object-fit: cover;
//   margin-right: 12px; /* PatientInfoPage의 MainHeaderProfileImage와 통일 */
// `;

const Name = styled.div`
  font-size: 2.2rem; /* PatientInfoPage와 통일 */
  font-weight: 700; /* PatientInfoPage와 통일 */
  color: #00499e; /* PatientInfoPage와 통일 */
`;

const InfoFormBox = styled.form`
  margin: 0; /* 중앙 정렬 대신 왼쪽 정렬 */
  width: 100%;
  max-width: none; /* 이전 PatientInfoPage와 동일하게 max-width 제거 */
  padding: 38px 28px 32px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px rgba(34, 97, 187, 0.09);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const Label = styled.label`
  font-size: 1.07rem;
  color: #2c2c2c;
  width: 88px;
  flex-shrink: 0; /* 레이블이 줄어들지 않도록 */
`;

const Input = styled.input`
  flex: 1;
  font-size: 1.09rem;
  padding: 14px 12px;
  border: 1.7px solid #e2e4e8;
  border-radius: 7px;
  background: #f8fafd;
  &:focus {
    border-color: #2261bb;
    background: #fff;
  }
`;

const SaveButton = styled.button`
  margin: 28px auto 0;
  padding: 12px 52px;
  background: #00499e; /* CalendarPage 및 PatientInfoPage와 통일 */
  color: #fff; /* CalendarPage 및 PatientInfoPage와 통일 */
  font-weight: 700;
  font-size: 1.13rem;
  border-radius: 19px;
  border: none;
  cursor: pointer;
  transition: background 0.16s;
  &:hover {
    background: #003a7a; /* CalendarPage 및 PatientInfoPage와 통일 */
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  color: #999;
  font-size: 1.01rem;
  letter-spacing: 0.04rem;
  span {
    color: #00499e; /* CalendarPage 및 PatientInfoPage와 통일 */
    cursor: pointer;
    border: none; /* 버튼처럼 보이던 스타일 제거 */
    background: none; /* 버튼처럼 보이던 스타일 제거 */
    margin: 0 8px; /* PatientInfoPage와 통일 */
    font-weight: 500; /* PatientInfoPage와 통일 */
    font-size: 1.03rem; /* PatientInfoPage와 통일 */
    transition: color 0.12s;
    &:hover {
      color: #ff4646;
    }
  }
`;

const GuardianInfoPage = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '', // 메인 주소
  });
  const [detailAddress, setDetailAddress] = useState(''); // 상세 주소

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showByeModal, setShowByeModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const myInfo = await getUserInfo();
        // 전화번호 포맷 적용
        const formattedPhone = formatPhoneNumber(myInfo.phone || '');

        // 전체 주소 문자열 → 메인주소 + 상세주소 분리
        const raw = myInfo.address || '';
        let main = raw;
        let detail = '';
        const m = raw.match(/^(.*\))\s*(.*)$/);
        if (m) {
          main = m[1];
          detail = m[2];
        }
        setForm({
          name: myInfo.name || '',
          email: myInfo.email || '',
          phone: formattedPhone, // 포맷된 전화번호 사용
          address: main,
        });
        setDetailAddress(detail);
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, phone: formatPhoneNumber(e.target.value) });
  };
  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(e.target.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullAddress = detailAddress ? `${form.address} ${detailAddress}` : form.address;
      await updateUserInfo({
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/-/g, ''), // 저장 시 하이픈 제거
        address: fullAddress,
      });
      alert('정보가 성공적으로 저장되었습니다.');
      // 변경된 정보 즉시 반영을 위해 페이지 새로고침 또는 상태 재요청
      // navigate(0); // 이 방법 대신, 사용자 정보를 다시 불러오는 로직을 실행하는 것이 더 좋습니다.
      const updatedInfo = await getUserInfo();
      const raw = updatedInfo.address || '';
      let main = raw;
      let detail = '';
      const m = raw.match(/^(.*\))\s*(.*)$/);
      if (m) {
        main = m[1];
        detail = m[2];
      }
      setForm({
        name: updatedInfo.name || '',
        email: updatedInfo.email || '',
        phone: formatPhoneNumber(updatedInfo.phone || ''),
        address: main,
      });
      setDetailAddress(detail);
    } catch (error) {
      console.error('정보 저장 실패', error);
      alert('정보 저장에 실패했습니다.');
    }
  };

  const handleSidebarChange = (key: string) => {
    navigate(`/guardians/${key}`);
  };
  const handleWithdrawClick = () => setShowConfirm(true);
  const handleConfirmCancel = () => setShowConfirm(false);
  const handleConfirmOk = () => {
    setShowConfirm(false);
    setShowPwModal(true);
  };
  const handlePwModalClose = () => setShowPwModal(false);
  const handlePwSuccess = () => {
    setShowPwModal(false);
    alert('회원 탈퇴 완료 (가짜)');
    setShowByeModal(true);
  };
  const handleByeClose = () => {
    setShowByeModal(false);
    navigate('/');
  };

  return (
    <>
      <PageWrapper>
        <SidebarBox>
          <ProfileSection>
            <ProfileImage
              src={
                user?.profileImageUrl ??
                'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
              }
              alt="프로필 사진"
            />
            <ProfileName>{user?.name ?? '로딩 중'} 님</ProfileName>
            <ProfileRole>보호자</ProfileRole>
          </ProfileSection>
          <SidebarMenu
            items={guardianSidebarItems}
            activeKey="info"
            onChange={handleSidebarChange}
          />
        </SidebarBox>

        <MainSection>
          <GuardianInfoHeader>
            <Name>{user?.name}님 정보</Name> {/* PatientInfoPage와 통일 */}
          </GuardianInfoHeader>

          <InfoFormBox onSubmit={handleSave}>
            {/* 이름, 이메일, 전화번호 */}
            <InputRow>
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" value={form.name} readOnly />
            </InputRow>
            <InputRow>
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" value={form.email} readOnly />
            </InputRow>
            <InputRow>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange} // 전화번호 포맷팅 함수 사용
                placeholder="전화번호 입력 (010-1234-5678)"
              />
            </InputRow>

            {/* 도로명 주소 검색 */}
            <InputRow>
              <Label htmlFor="address">주소</Label>
              <div style={{ flex: 1 }}>
                <DaumPost
                  address={form.address}
                  setAddress={(addr) => setForm((prev) => ({ ...prev, address: addr }))}
                />
              </div>
            </InputRow>

            {/* 상세 주소 입력 */}
            <InputRow>
              <Label htmlFor="detailAddress">상세 주소</Label>
              <Input
                id="detailAddress"
                type="text"
                value={detailAddress}
                onChange={handleDetailAddressChange} // 상세 주소 변경 함수 사용
                placeholder="상세주소 입력 (예: 111동 1234호)"
              />
            </InputRow>

            <SaveButton type="submit">저장</SaveButton>
          </InfoFormBox>

          <Footer>
            <span onClick={handleWithdrawClick}>회원탈퇴</span>
          </Footer>
        </MainSection>
      </PageWrapper>

      {/* 탈퇴 3단계 모달들 - 스타일 통일 */}
      <ReusableModal open={showConfirm} onClose={handleConfirmCancel} hideCloseButton>
        <div
          style={{ fontSize: '1.13rem', fontWeight: 600, marginBottom: 24, textAlign: 'center' }}
        >
          정말 탈퇴하시겠습니까?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button
            onClick={handleConfirmCancel}
            style={{
              background: '#f3f3f3',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px', // PatientInfoPage와 통일
              color: '#555',
              fontWeight: 500,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'background 0.16s',
              '&:hover': { background: '#e0e0e0' },
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirmOk}
            style={{
              background: '#ff4646',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px', // PatientInfoPage와 통일
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'background 0.16s',
              '&:hover': { background: '#cc3737' },
            }}
          >
            탈퇴하기
          </button>
        </div>
      </ReusableModal>
      <PasswordModal open={showPwModal} onClose={handlePwModalClose} onSuccess={handlePwSuccess} />
      <ReusableModal open={showByeModal} onClose={handleByeClose} hideCloseButton>
        <div
          style={{
            color: '#00499e', // PatientInfoPage와 통일
            fontWeight: 700,
            fontSize: '1.2rem', // PatientInfoPage와 통일
            marginBottom: 20, // PatientInfoPage와 통일
            whiteSpace: 'pre-line',
            textAlign: 'center',
          }}
        >
          그동안 닥투를 이용해주셔서 감사합니다.
          <br />
          안녕히 가세요!
        </div>
        <button
          onClick={handleByeClose}
          style={{
            marginTop: 20,
            padding: '12px 24px',
            backgroundColor: '#00499e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            width: '100%',
            maxWidth: '150px',
            margin: '20px auto 0 auto',
          }}
        >
          확인
        </button>
      </ReusableModal>
    </>
  );
};

export default GuardianInfoPage;
