import React from 'react';
import { useNavigate } from 'react-router-dom';

type Hospital = {
  hospitalId: number;
  name: string;
  phone: string;
  address: string;
  openHours: string;
};

type Props = {
  hospital: Hospital;
};

function HospitalCard({ hospital }: Props) {
  const navigate = useNavigate();

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginTop: 10 }}>
      <div style={{ fontWeight: 'bold' }}>{hospital.name}</div>
      <div>📍 {hospital.address}</div>
      <div>☎️ {hospital.phone}</div>
      <div>🕐 {hospital.openHours}</div>
      <button onClick={() => navigate(`/hospital/${hospital.hospitalId}`)}>상세보기</button>
    </div>
  );
}

export default HospitalCard;
