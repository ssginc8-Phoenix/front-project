import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCsNotes, saveCsNote, type CsNoteDto } from '~/features/cs/api/csAPI';

export const useCsNotes = (csRoomId: number, page: number = 0, size: number = 20) =>
  useQuery<CsNoteDto[], Error>({
    queryKey: ['csNotes', csRoomId, page],
    queryFn: async () => {
      const res = await fetchCsNotes(csRoomId, page, size);
      return res.content;
    },
    // keepPreviousData: true,  <-- 제거!
  });

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
