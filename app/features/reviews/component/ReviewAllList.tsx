import React from 'react';
import type { ReviewAllListResponse } from '../types/review';

interface Props {
  reviews: ReviewAllListResponse[];
}

export function ReviewAllList({ reviews }: Props) {
  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.reviewId} className="p-4 border rounded shadow-sm">
          <p className="text-sm text-gray-500 mb-1">
            🏥 {r.hospitalName} ({r.hospitalId}) · 작성일: {new Date(r.createdAt).toLocaleString()}
            {r.updatedAt && <> · 수정일: {new Date(r.updatedAt).toLocaleString()}</>}
          </p>
          <p className="mt-1">{r.contents}</p>
          <p className="text-xs text-red-600 mt-1">신고 수: {r.reportCount}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {r.keywords.map((k) => (
              <span key={k} className="px-2 py-1 bg-blue-100 rounded text-xs">
                {k}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
