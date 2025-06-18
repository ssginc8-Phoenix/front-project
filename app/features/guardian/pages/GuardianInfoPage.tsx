// src/features/guardian/pages/GuardianInfoPage.tsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SidebarMenu from '~/features/guardian/components/SidebarMenu';
import { guardianSidebarItems } from '~/features/guardian/constants/sidebarItems';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo, updateUserInfo } from '~/features/patient/api/userAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { PasswordModal } from '~/features/patient/components/PasswordModal';

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

const SidebarBox = styled.div`
  width: 250px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(34, 97, 187, 0.05);
  padding: 32px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 36px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
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

const MainSection = styled.section`
  flex: 1;
  min-width: 420px;
  max-width: 700px;
`;

const GuardianInfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileInfo = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 10px 0 20px;
`;

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const InfoFormBox = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
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
        // 전체 주소 문자열 → 메인주소 + 상세주소 분리
        const raw = myInfo.address || '';
        let main = raw;
        let detail = '';
        // 예시: "서울 마포구 하늘공원로 108 (상암동) 111-1234"
        const m = raw.match(/^(.*\))\s*(.*)$/);
        if (m) {
          main = m[1]; // "서울 마포구 하늘공원로 108 (상암동)"
          detail = m[2]; // "111-1234"
        }
        setForm({
          name: myInfo.name || '',
          email: myInfo.email || '',
          phone: myInfo.phone || '',
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 저장할 때 다시 합쳐서 보냄
      const fullAddress = detailAddress ? `${form.address} ${detailAddress}` : form.address;
      await updateUserInfo({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: fullAddress,
      });
      alert('정보가 성공적으로 저장되었습니다.');
      // 다시 불러와서 상태 업데이트
      navigate(0);
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
      <PageBg>
        <FlexRow>
          <SidebarBox>
            <ProfileSection>
              <ProfileImage
                src={
                  user?.profileImageUrl ??
                  'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
                }
                alt="프로필"
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
              <ProfileInfo
                src={
                  user?.profileImageUrl ??
                  'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
                }
                alt="프로필"
              />
              <Name>{user?.name} 님</Name>
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
                  onChange={handleChange}
                  placeholder="전화번호 입력"
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
                <Label>상세 주소</Label>
                <Input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
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
      </PageBg>

      {/* 탈퇴 3단계 모달들 */}
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
      <PasswordModal open={showPwModal} onClose={handlePwModalClose} onSuccess={handlePwSuccess} />
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
    </>
  );
};

export default GuardianInfoPage;
