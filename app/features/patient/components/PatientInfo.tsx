import React, { useEffect, useState } from 'react';
import type { Patient } from '~/features/patient/types/patient';
import { getPatientList } from '~/features/patient/api/patientAPI';

/**
 * 환자 정보(목록) 컴포넌트
 */
const PatientInfo: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPatientList()
      .then((data) => setPatients(data))
      .catch((e) => setError(e?.message ?? '알 수 없는 에러'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">에러: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-xl font-bold mb-6">환자 목록</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">환자ID</th>
            <th className="px-4 py-2 border">유저ID</th>
            <th className="px-4 py-2 border">주민등록번호</th>
            <th className="px-4 py-2 border">생성일자</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                환자 정보가 없습니다.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.patientId} className="text-center">
                <td className="border px-4 py-2">{patient.patientId}</td>
                <td className="border px-4 py-2">{patient.userId}</td>
                <td className="border px-4 py-2">{patient.residentRegistrationNumber}</td>
                <td className="border px-4 py-2">{patient.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientInfo;
