import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCsNotes, saveCsNote, type CsNoteDto } from '~/features/cs/api/csAPI';

// 상담 내역 조회 훅
export const useCsNotes = (csRoomId: number, page: number = 0, size: number = 20) => {
  return useQuery<
    {
      content: CsNoteDto[];
      totalPages: number;
      totalElements: number;
      number: number;
      size: number;
    },
    Error
  >({
    queryKey: ['csNotes', csRoomId, page],
    queryFn: () => fetchCsNotes(csRoomId, page, size),
  });
};

// 상담 내역 저장 훅
export const useSaveCsNote = (csRoomId: number) => {
  const queryClient = useQueryClient();

  return useMutation<CsNoteDto, Error, { agentId: number; content: string }>({
    mutationFn: (payload) => saveCsNote(csRoomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['csNotes', csRoomId] });
    },
  });
};
