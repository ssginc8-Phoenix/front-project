// src/features/medication/pages/MedicationLogPage.tsx
import React, { useEffect, useState } from 'react';
import { getMyMedicationLogs } from '~/features/medication/api/medicationAPI';
import type { MedicationLogResponse } from '~/features/medication/types/types';

interface Page<T> {
  content: T[];
  number: number; // 현재 페이지 (0부터)
  size: number; // 페이지 크기
  totalElements: number; // 전체 아이템 수
  totalPages: number; // 전체 페이지 수
}

/**
 * 서버에서 내려주는 "yyyy‑MM‑ddTHH:mm:ss.SSSSSS" 형태 문자열을
 * 브라우저가 인식하는 ISO 포맷으로 변환
 */
function parseToValidDate(raw: string): Date {
  // 마이크로초 이후 제거
  const noMicros = raw.split('.')[0];
  // 'Z' 붙여 UTC 로 파싱
  return new Date(noMicros + 'Z');
}

export function MedicationLogPage() {
  const [logsPage, setLogsPage] = useState<Page<MedicationLogResponse> | null>(null);
  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyMedicationLogs(page, size);
        setLogsPage(data);
      } catch (e) {
        console.error('약 복용 로그 조회 실패', e);
      }
    })();
  }, [page]);

  if (!logsPage) {
    return <div>로딩 중...</div>;
  }

  const { content, number, totalPages } = logsPage;

  // 공통 스타일 정의
  const headerStyle: React.CSSProperties = {
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    padding: '0.5rem',
  };
  const cellStyle: React.CSSProperties = {
    textAlign: 'left',
    borderBottom: '1px solid #eee',
    padding: '0.5rem',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>약 복용 기록 내역</h1>

      {/* 가로 스크롤 대비 */}
      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {/* 열 너비 고정으로 헤더와 셀 정렬 보장 */}
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>

          <thead>
            <tr>
              <th style={headerStyle}>복용일시</th>
              <th style={headerStyle}>약 이름</th>
              <th style={headerStyle}>상태</th>
            </tr>
          </thead>

          <tbody>
            {content.length > 0 ? (
              content.map((log) => {
                const dt = parseToValidDate(log.loggedAt || log.completedAt);
                return (
                  <tr key={log.medicationLogId || log.logId}>
                    <td style={cellStyle}>
                      {isNaN(dt.getTime()) ? '–' : dt.toLocaleString('ko-KR')}
                    </td>
                    <td style={cellStyle}>{log.medicationName}</td>
                    <td style={cellStyle}>{log.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '1rem', textAlign: 'center' }}>
                  복용 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 컨트롤 */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <button disabled={number <= 0} onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>
          이전
        </button>
        <span>
          {number + 1} / {totalPages}
        </span>
        <button
          disabled={number + 1 >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        >
          다음
        </button>
      </div>
    </div>
  );
}
