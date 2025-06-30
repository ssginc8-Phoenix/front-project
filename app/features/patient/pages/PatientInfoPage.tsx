import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getUserInfo, updateUserInfo } from '~/features/patient/api/userAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';
import { ContentBody, Icon, media, Title, Wrapper } from '~/components/styled/MyPage.styles';
import {
  CustomFileInputButton,
  Footer,
  HiddenInput,
  ImagePreview,
  ImageUploadContainer,
  InfoFormBox,
  Input,
  InputRow,
  Label,
  Name,
  SaveButton,
} from '~/components/styled/Info.styles';

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 7);
  const part3 = digits.slice(7, 11);
  if (digits.length > 7) return `${part1}-${part2}-${part3}`;
  if (digits.length > 3) return `${part1}-${part2}`;
  return part1;
};

const PatientInfoPage = () => {
  const { user, fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [detailAddress, setDetailAddress] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showByeModal, setShowByeModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchMyInfo();
        const myInfo = await getUserInfo();

        const raw = myInfo.address || '';
        let main = raw,
          detail = '';
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
        setPreviewUrl(myInfo.profileImageUrl || null);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패', error);
      }
    };
    fetchUser();
  }, [fetchMyInfo]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, phone: formatPhoneNumber(e.target.value) });
  };
  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(e.target.value);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullAddress = detailAddress ? `${form.address} ${detailAddress}` : form.address;
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone.replace(/-/g, ''));
      formData.append('address', fullAddress);
      if (profileImage) formData.append('profileImage', profileImage);

      await updateUserInfo(formData);
      await fetchMyInfo();
      alert('정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('정보 저장 실패', error);
      alert('정보 저장에 실패했습니다.');
    }
  };

  return (
    <Wrapper>
      <Title>
        <Icon>⚙️</Icon>
        <Name>{user?.name}</Name>님 정보
      </Title>

      <ContentBody>
        <InfoFormBox onSubmit={handleSave}>
          <InputRow>
            <Label htmlFor="name">이름</Label>
            <Input id="name" value={form.name} readOnly />
          </InputRow>
          <InputRow>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" value={form.email} readOnly />
          </InputRow>
          <InputRow>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
            />
          </InputRow>
          <InputRow>
            <Label htmlFor="address">주소</Label>
            <div style={{ flex: 1 }}>
              <DaumPost
                address={form.address}
                setAddress={(addr) => setForm((prev) => ({ ...prev, address: addr }))}
              />
            </div>
          </InputRow>
          <InputRow>
            <Label htmlFor="detailAddress">상세 주소</Label>
            <Input
              id="detailAddress"
              value={detailAddress}
              onChange={handleDetailAddressChange}
              placeholder="예: 111동 1234호"
            />
          </InputRow>
          <ImageUploadContainer>
            <Label htmlFor="profileImage">프로필 이미지</Label>
            {previewUrl && <ImagePreview src={previewUrl} alt="미리보기" />}
            <HiddenInput
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <CustomFileInputButton htmlFor="profileImage">이미지 선택</CustomFileInputButton>
          </ImageUploadContainer>
          <SaveButton type="submit">정보 저장</SaveButton>
        </InfoFormBox>
        <Footer>
          <span onClick={() => setShowConfirm(true)}>회원탈퇴</span>
        </Footer>
      </ContentBody>

      <ReusableModal open={showConfirm} onClose={() => setShowConfirm(false)} hideCloseButton>
        <div
          style={{ fontSize: '1.13rem', fontWeight: 600, marginBottom: 24, textAlign: 'center' }}
        >
          정말 탈퇴하시겠습니까?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              background: '#f3f3f3',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px',
              color: '#555',
              fontWeight: 500,
            }}
          >
            취소
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              setShowPwModal(true);
            }}
            style={{
              background: '#ff4646',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            탈퇴하기
          </button>
        </div>
      </ReusableModal>
      <PasswordModal
        open={showPwModal}
        onClose={() => setShowPwModal(false)}
        onSuccess={() => {
          setShowPwModal(false);
          alert('회원 탈퇴 완료 (가짜)');
          setShowByeModal(true);
        }}
      />
      <ReusableModal
        open={showByeModal}
        onClose={() => {
          setShowByeModal(false);
          navigate('/');
        }}
        hideCloseButton
      >
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
          onClick={() => {
            setShowByeModal(false);
            navigate('/');
          }}
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
    </Wrapper>
  );
};

export default PatientInfoPage;
