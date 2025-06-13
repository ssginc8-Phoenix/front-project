import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

const daysOfWeek = ['월', '화', '수', '목', '금', '토'];

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const DayCard = styled.button`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3a8a;
  transition: 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #eef2ff;
    border-color: #6366f1;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e40af;
  text-align: center;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(to right, #6366f1, #4f46e5);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.2s;

  &:hover {
    background: linear-gradient(to right, #4f46e5, #4338ca);
  }
`;

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
    console.log(`✅ ${selectedDay} 진료시간: ${startTime} ~ ${endTime}`);
    closeModal();
  };

  return (
    <Wrapper>
      <Title>🕒 요일별 진료시간 설정</Title>
      <DaysGrid>
        {daysOfWeek.map((day) => (
          <DayCard key={day} onClick={() => openModal(day)}>
            {day}요일
          </DayCard>
        ))}
      </DaysGrid>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="진료시간 설정"
        style={{
          content: {
            maxWidth: '450px',
            margin: 'auto',
            padding: '2rem',
            borderRadius: '16px',
            background: '#f8fafc',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
        }}
      >
        <ModalContent>
          <ModalTitle>{selectedDay}요일 진료시간 설정</ModalTitle>
          <div>
            <Label>시작 시간</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <Label>종료 시간</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

export default DoctorScheduleForm;
