import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { Hospital } from '../../../types/hospital';

interface Props {
  hospital: Hospital;
  onClose: () => void;
}

const Panel = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 1.2rem;
  z-index: 100;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const DetailButton = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const HospitalDetailPanel = ({ hospital, onClose }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/hospitals/${hospital.hospitalId}`);
  };

  return (
    <Panel>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h2>{hospital.hospitalName}</h2>
      <p>
        <strong>주소:</strong> {hospital.address}
      </p>
      <p>
        <strong>전문분야:</strong> {hospital.specialization}
      </p>

      <DetailButton onClick={handleNavigate}>병원 상세 보기</DetailButton>
    </Panel>
  );
};

export default HospitalDetailPanel;
