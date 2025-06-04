// features/patient/PatientListPage.tsx
import React from 'react';
import { usePatientList } from '../features/patient/hooks/usePatientList';

export const PatientListPage = () => {
  const { data: patients, loading, error } = usePatientList();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-xl font-bold mb-6">환자 목록</h2>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">에러: {error}</div>}
      {!loading && !error && (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">유저ID</th>
              <th className="px-4 py-2 border">주민등록번호</th>
              <th className="px-4 py-2 border">생성일자</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientId} className="text-center">
                <td className="border px-4 py-2">{patient.patientId}</td>
                <td className="border px-4 py-2">{patient.userId}</td>
                <td className="border px-4 py-2">{patient.residentRegistrationNumber}</td>
                <td className="border px-4 py-2">{patient.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientListPage;
