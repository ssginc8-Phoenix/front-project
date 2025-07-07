// src/features/documents/pages/AdminInsuranceDocumentsPage.tsx
import React, { useEffect, useState } from 'react';

import {
  useAttachFile,
  useApprove,
  useAdminDocumentList,
} from '~/features/documents/hooks/useDocumentRequests';
import DocumentListTable from '~/features/documents/components/DocumentListTable';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

const AdminInsuranceDocumentsPage: React.FC = () => {
  const [hospitalId, setHospitalId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyHospital();
        setHospitalId(res.hospitalId);
      } catch (e) {
        console.error('병원 정보 조회 실패:', e);
      }
    })();
  }, []);

  const { data: docs, isLoading, isError, error } = useAdminDocumentList(hospitalId || undefined);

  const attachMutation = useAttachFile();
  const approveMutation = useApprove();

  if (!hospitalId) {
    return <p>병원 정보를 불러오는 중입니다...</p>;
  }

  if (isLoading) {
    return <p>문서 목록을 불러오는 중입니다...</p>;
  }

  if (isError) {
    return <p>문서 목록을 불러오는 중 오류가 발생했습니다: {error?.message || String(error)}</p>;
  }

  const handleAttach = (id: number, file: File) => {
    attachMutation.mutate({ id, file });
  };

  const handleApprove = (id: number, approved: boolean, reason?: string) => {
    approveMutation.mutate({ id, dto: { approved, reason } });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>보험 서류 관리</h1>
      <DocumentListTable
        data={docs?.content ?? []}
        onAttach={handleAttach}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default AdminInsuranceDocumentsPage;
