export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for user uploads
  timestamp: number;
  isThinking?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export enum Sender {
  USER = 'user',
  MODEL = 'model'
}