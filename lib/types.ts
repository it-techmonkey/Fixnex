export interface Service {
  category: string;
  name: string;
  currency: string;
  customQuote: boolean;
  normalPrice: number | null;
  memberPrice: number | null;
  normalPriceText: string | null;
  memberPriceText: string | null;
  keywords: string[];
}

export interface Booking {
  service: string;
  date: string;
  time: string;
  subscriber: boolean;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ConversationState {
  sessionId: string;
  service: string | null;
  date: string | null;
  time: string | null;
  subscriber: boolean | null;
  expecting: "service" | "date" | "time" | "subscriber" | "complete" | null;
  messages: ChatMessage[];
}

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
  expecting: "service" | "date" | "time" | "subscriber" | "complete" | null;
  showForm: boolean;
  service?: string | null;
  date?: string | null;
  time?: string | null;
  subscriber?: boolean | null;
}

export interface PatternMatchResult {
  intent: "service" | "date" | "time" | "subscriber" | "unknown";
  service?: string;
  date?: string;
  time?: string;
  subscriber?: boolean;
  confidence: number;
}

export interface BookingFormData {
  service: string;
  date: string;
  time: string;
  subscriber: boolean;
}

