export interface KeystrokeEvent {
  down: number;
  up: number;
  duration: number;
  isCorrection?: boolean;
}

export interface PasteEvent {
  timestamp: number;
  length: number;
}

export interface WritingSession {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  keystrokes: KeystrokeEvent[];
  pastes: PasteEvent[];
}

export interface SessionMetrics {
  words: number;
  chars: number;
  keys: number;
  pastes: number;
  durationMs: number;
  wpm: number;
  correctionRate: number;
  longPauses: number;
  avgDwell: number;
  maxBurstWpm: number;
}
