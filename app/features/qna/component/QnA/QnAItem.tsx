import React from 'react';
import type { QaPostResponse } from '~/types/qna';

interface Props {
  post: QaPostResponse;
  onClick: () => void;
}

export default function QnAItem({ post, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full block text-left p-3 border rounded hover:bg-gray-50"
    >
      <p className="font-medium">{post.content}</p>
      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
    </button>
  );
}
