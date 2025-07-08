import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { createWaiting, getWaiting, getMyHospital } from '~/features/hospitals/api/hospitalAPI';
import { showErrorAlert, showSuccessAlert } from '~/components/common/alert';

interface WaitModalProps {
  onClose: () => void;
}

const WaitModal: React.FC<WaitModalProps> = ({ onClose }) => {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchHospitalAndWaiting = async () => {
      try {
        const hospital = await getMyHospital();
        setHospitalId(hospital.hospitalId);

        const res = await getWaiting(hospital.hospitalId);
        if (typeof res === 'number') setCount(res);
        else if (res.waiting) setCount(res.waiting);
      } catch (error) {
        console.error('병원 또는 대기 정보 불러오기 실패', error);
        showErrorAlert('데이터 로딩 실패', '병원 또는 대기 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchHospitalAndWaiting();
  }, []);

  const handleRegisterWaiting = async () => {
    if (!hospitalId) {
      showErrorAlert('오류', '병원 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      await createWaiting(hospitalId, count);
      showSuccessAlert('등록 완료', `대기 인원 ${count}명 등록이 완료되었습니다.`);
      onClose(); // 모달 닫기
    } catch (err) {
      console.error('대기 등록 에러', err);
      showErrorAlert('대기 등록 실패', '대기 인원 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <Title>대기 인원 등록</Title>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </CloseButton>
        </Header>

        <Counter>
          <AdjustButton type="button" onClick={() => setCount((prev) => Math.max(prev - 1, 0))}>
            -
          </AdjustButton>
          <CountInput
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          <AdjustButton type="button" onClick={() => setCount((prev) => prev + 1)}>
            +
          </AdjustButton>
        </Counter>

        <Actions>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <ConfirmButton type="button" onClick={handleRegisterWaiting}>
            등록
          </ConfirmButton>
        </Actions>
      </ModalBox>
    </Overlay>
  );
};

export default WaitModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const AdjustButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #e5e7eb;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d1d5db;
  }
`;

const CountInput = styled.input`
  width: 80px;
  text-align: center;
  font-size: 1rem;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
  transition: box-shadow 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ButtonBase = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
`;

const CancelButton = styled(ButtonBase)`
  background: #f3f4f6;
  color: #374151;
  border: none;

  &:hover {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled(ButtonBase)`
  background: #3b82f6;
  color: #ffffff;
  border: none;

  &:hover {
    background: #2563eb;
  }
`;
