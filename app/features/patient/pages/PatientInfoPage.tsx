// src/features/patient/pages/PatientInfoPage.tsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo, updateUserInfo } from '~/features/patient/api/userAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';
import type { User } from '~/types/user';
import Sidebar from '~/common/Sidebar';

// 전화번호 3-4-4 포맷 함수
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 7);
  const part3 = digits.slice(7, 11);
  if (digits.length > 7) return `${part1}-${part2}-${part3}`;
  if (digits.length > 3) return `${part1}-${part2}`;
  return part1;
};

const PatientPageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  //background-color: #f0f4f8;
  font-family: 'Segoe UI', sans-serif;
`;

const MainSection = styled.section`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 900px;
  margin-left: 48px; /* 사이드바와의 간격 유지 */
`;

const PatientInfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
`;

const Name = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
`;

const InfoFormBox = styled.form`
  margin: 0;
  width: 100%;
  max-width: none;
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

const AddressWrapper = styled.div`
  flex: 1;
`;

const Label = styled.label`
  font-size: 1.07rem;
  color: #2c2c2c;
  width: 88px;
  flex-shrink: 0;
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
  background: #00499e;
  color: #fff;
  font-weight: 700;
  font-size: 1.13rem;
  border-radius: 19px;
  border: none;
  cursor: pointer;
  transition: background 0.16s;
  &:hover {
    background: #003a7a;
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  color: #999;
  font-size: 1.01rem;
  letter-spacing: 0.04rem;

  span {
    color: #00499e;
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
  const [detailAddress, setDetailAddress] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showByeModal, setShowByeModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchMyInfo();
        const myInfo = await getUserInfo();
        setUserinfo(myInfo);

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
          phone: formatPhoneNumber(myInfo.phone || ''),
          address: main,
        });
        setDetailAddress(detail);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error);
      }
    };

    fetchUser();
  }, [fetchMyInfo]);

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
      const fullAddress = form.address + (detailAddress ? ' ' + detailAddress : '');
      await updateUserInfo({ ...form, address: fullAddress });
      alert('정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('정보 저장 실패', error);
      alert('정보 저장에 실패했습니다.');
    }
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
      <PatientPageWrapper>
        <Sidebar />

        <MainSection>
          <PatientInfoHeader>
            <Name>{user?.name} 님 정보</Name>
          </PatientInfoHeader>

          <InfoFormBox onSubmit={handleSave}>
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
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
              />
            </InputRow>

            <InputRow>
              <Label>주소</Label>
              <AddressWrapper>
                <DaumPost
                  address={form.address}
                  setAddress={(newAddr) => setForm({ ...form, address: newAddr })}
                />
              </AddressWrapper>
            </InputRow>

            <InputRow>
              <Label htmlFor="detailAddress">상세주소</Label>
              <Input
                id="detailAddress"
                value={detailAddress}
                onChange={handleDetailAddressChange}
                placeholder="상세 주소를 입력하세요. 예: 111동 1234호"
              />
            </InputRow>

            <SaveButton type="submit">저장</SaveButton>
          </InfoFormBox>

          <Footer>
            <span onClick={handleWithdrawClick}>회원탈퇴</span>
          </Footer>
        </MainSection>
      </PatientPageWrapper>

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
              padding: '10px 24px',
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
              padding: '10px 24px',
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
            color: '#00499e',
            fontWeight: 700,
            fontSize: '1.2rem',
            marginBottom: 20,
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

export default PatientInfoPage;
