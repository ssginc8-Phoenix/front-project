import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const DayButton = styled.button`
  padding: 1rem;
  width: 100%;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #e0e0ff;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SaveButton = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #3730a3;
  }
`;

// Modal.setAppElement('#root');

const DoctorScheduleForm = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (day: string) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const handleSave = () => {
    // 여기에 API 호출 로직 추가 가능
    console.log(`✅ ${selectedDay} 진료시간: ${startTime} ~ ${endTime}`);
    closeModal();
  };

  return (
    <Wrapper>
      <h2>🕒 요일별 진료시간 설정</h2>
      {daysOfWeek.map((day) => (
        <DayButton key={day} onClick={() => openModal(day)}>
          {day}요일
        </DayButton>
      ))}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="진료시간 설정"
        style={{
          content: {
            maxWidth: '400px',
            margin: 'auto',
            padding: '2rem',
            borderRadius: '12px',
          },
        }}
      >
        <ModalContent>
          <h3>{selectedDay}요일 진료시간 설정</h3>
          <Label>시작 시간</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Label>종료 시간</Label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

export default DoctorScheduleForm;
