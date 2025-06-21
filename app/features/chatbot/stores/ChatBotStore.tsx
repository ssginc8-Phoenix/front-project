import { create } from 'zustand';
import type { ChatMessage } from '~/types/chatbot';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  reset: () => void;
}

export const useChatBotStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  reset: () => set({ messages: [] }),
}));
