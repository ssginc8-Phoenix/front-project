// src/features/patient/pages/PatientInfoPage.tsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo, updateUserInfo } from '~/features/patient/api/userAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';
import type { User } from '~/types/user';

// --- 스타일 정의 ---
const PageBg = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #f5f8fd;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 54px;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-left: 48px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainSection = styled.section`
  flex: 1;
  min-width: 420px;
  max-width: 700px;
`;

const SidebarBox = styled.div`
  width: 250px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px 0 rgba(34, 97, 187, 0.05);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const ProfileEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
`;

const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
`;

const PatientInfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Emoji = styled.div`
  font-size: 48px;
  margin-right: 16px;
`;

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const InfoFormBox = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  padding: 38px 28px 32px 28px;
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
`;

const Input = styled.input`
  flex: 1 1 auto;
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
  margin: 28px auto 0 auto;
  padding: 12px 52px;
  background: #bfd6fa;
  color: #1646a0;
  font-weight: 700;
  font-size: 1.13rem;
  border-radius: 19px;
  border: none;
  cursor: pointer;
  transition: background 0.16s;
  &:hover {
    background: #a7c7f7;
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  color: #999;
  font-size: 1.01rem;
  letter-spacing: 0.04rem;

  span {
    color: #2261bb;
    cursor: pointer;
    border: none;
    background: none;
    margin: 0 8px;
    font-weight: 500;
    font-size: 1.03rem;
    transition: color 0.12s;
    &:hover {
      color: #ff4646;
    }
  }
`;

const PatientInfoPage = () => {
  const { user, fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showByeModal, setShowByeModal] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchMyInfo();
        const myInfo = await getUserInfo();
        setUserinfo(myInfo);
        setForm({
          name: myInfo.name || '',
          email: myInfo.email || '',
          phone: myInfo.phone || '',
          address: myInfo.address || '',
        });
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullAddress = form.address + (detailAddress ? ' ' + detailAddress : '');
      await updateUserInfo({
        ...form,
        address: fullAddress, // ✅ 주소 + 상세주소 합쳐서 보내기
      });
      alert('정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('정보 저장 실패', error);
      alert('정보 저장에 실패했습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(e.target.value);
  };

  const handleSidebarChange = (key: string) => {
    navigate(`/patients/${key}`);
  };

  const handleWithdrawClick = () => setShowConfirm(true);
  const handleConfirmCancel = () => setShowConfirm(false);
  const handleConfirmOk = () => {
    setShowConfirm(false);
    setShowPwModal(true);
  };
  const handlePwModalClose = () => setShowPwModal(false);

  const handlePwSuccess = async () => {
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
      <PageBg>
        <FlexRow>
          <SidebarBox>
            {/* 프로필 영역 */}
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

            {/* 메뉴 */}
            <SidebarMenu
              items={patientSidebarItems}
              activeKey={'info'}
              onChange={handleSidebarChange}
            />
          </SidebarBox>

          <MainSection>
            <PatientInfoHeader>
              <Emoji>👵</Emoji>
              <div>
                <Name>{user?.name} 님</Name>
              </div>
            </PatientInfoHeader>

            <InfoFormBox onSubmit={handleSave}>
              <InputRow>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="이름 입력"
                />
              </InputRow>
              <InputRow>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="이메일 입력"
                />
              </InputRow>
              <InputRow>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="전화번호 입력"
                />
              </InputRow>
              {/* 주소 검색 */}
              <InputRow>
                <Label>주소</Label>
                <DaumPost
                  address={form.address}
                  setAddress={(newAddr) => setForm({ ...form, address: newAddr })}
                />
              </InputRow>
              {/* 상세주소 입력 */}
              <InputRow>
                <Label htmlFor="detail">상세주소</Label>
                <Input
                  id="detail"
                  name="detail"
                  value={detailAddress}
                  onChange={handleDetailAddressChange}
                  placeholder="상세주소 입력"
                />
              </InputRow>
              <SaveButton type="submit">저장</SaveButton>
            </InfoFormBox>

            <Footer>
              <span onClick={handleWithdrawClick}>회원탈퇴</span>
            </Footer>
          </MainSection>
        </FlexRow>

        {/* --- 탈퇴 1단계 모달 --- */}
        <ReusableModal open={showConfirm} onClose={handleConfirmCancel} hideCloseButton>
          <div style={{ fontSize: '1.13rem', fontWeight: 600, marginBottom: 24 }}>
            정말 탈퇴하시겠습니까?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
            <button
              onClick={handleConfirmCancel}
              style={{
                background: '#f3f3f3',
                borderRadius: 16,
                border: 'none',
                padding: '8px 22px',
                color: '#555',
                fontWeight: 500,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              onClick={handleConfirmOk}
              style={{
                background: '#ffd6d6',
                borderRadius: 16,
                border: 'none',
                padding: '8px 22px',
                color: '#ff4646',
                fontWeight: 600,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              탈퇴하기
            </button>
          </div>
        </ReusableModal>

        {/* --- 탈퇴 2단계 비밀번호 모달 --- */}
        <PasswordModal
          open={showPwModal}
          onClose={handlePwModalClose}
          onSuccess={handlePwSuccess}
        />

        {/* --- 탈퇴 3단계 완료 모달 --- */}
        <ReusableModal open={showByeModal} onClose={handleByeClose} hideCloseButton>
          <div
            style={{
              color: '#2261bb',
              fontWeight: 700,
              fontSize: '1.11rem',
              marginBottom: 2,
              whiteSpace: 'pre-line',
            }}
          >
            그동안 닥투를 이용해주셔서 감사합니다.
            <br />
            안녕히 가세요!
          </div>
        </ReusableModal>
      </PageBg>
    </>
  );
};

export default PatientInfoPage;
