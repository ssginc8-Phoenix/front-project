export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  data?: {
    hospitalId?: number;
  };
}
