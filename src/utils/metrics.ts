import { WritingSession, SessionMetrics } from '../types';

export const calculateMetrics = (session: WritingSession): SessionMetrics => {
  const words = session.content.trim() ? session.content.trim().split(/\s+/).length : 0;
  const chars = session.content.length;
  const keys = session.keystrokes.length;
  const pastes = session.pastes.length;
  
  let durationMs = 0;
  if (session.keystrokes.length > 1) {
    durationMs = session.keystrokes[session.keystrokes.length - 1].up - session.keystrokes[0].down;
  }
  
  const durationMin = durationMs / 60000;
  const wpm = durationMin > 0 ? Math.round(words / durationMin) : 0;
  
  const corrections = session.keystrokes.filter(k => k.isCorrection).length;
  const correctionRate = keys > 0 ? Math.round((corrections / keys) * 100) : 0;
  
  // Long pauses (> 3 seconds)
  let longPauses = 0;
  for (let i = 0; i < session.keystrokes.length - 1; i++) {
    const gap = session.keystrokes[i+1].down - session.keystrokes[i].up;
    if (gap > 3000) longPauses++;
  }

  const avgDwell = keys > 0 
    ? Math.round(session.keystrokes.reduce((acc, k) => acc + k.duration, 0) / keys) 
    : 0;

  // Burst Speed (Max WPM in a short window)
  let maxBurstWpm = 0;
  const windowSize = 20; // 20 keystrokes
  if (session.keystrokes.length >= windowSize) {
    for (let i = 0; i <= session.keystrokes.length - windowSize; i++) {
      const windowDuration = (session.keystrokes[i + windowSize - 1].up - session.keystrokes[i].down) / 60000;
      const windowWords = windowSize / 5; // Standard 5 chars per word
      const windowWpm = windowDuration > 0 ? Math.round(windowWords / windowDuration) : 0;
      if (windowWpm > maxBurstWpm) maxBurstWpm = windowWpm;
    }
  }

  return {
    words,
    chars,
    keys,
    pastes,
    durationMs,
    wpm,
    correctionRate,
    longPauses,
    avgDwell,
    maxBurstWpm
  };
};

export const formatDuration = (ms: number): string => {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  return min > 0 ? `${min}m ${sec % 60}s` : `${sec}s`;
};
