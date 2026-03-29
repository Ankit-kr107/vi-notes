import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Footer } from './components/Footer';
import { HistorySidebar } from './components/HistorySidebar';
import { AnalysisModal } from './components/AnalysisModal';
import { WritingSession, KeystrokeEvent, PasteEvent } from './types';

export default function App() {
  const [content, setContent] = useState('');
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [analyzingSession, setAnalyzingSession] = useState<WritingSession | null>(null);
  
  // Use refs for high-frequency data to avoid unnecessary re-renders
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const pastesRef = useRef<PasteEvent[]>([]);
  const activeKeys = useRef<Map<string, number>>(new Map());
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Stats for UI
  const [stats, setStats] = useState({ keys: 0, pastes: 0 });

  // Load sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vi-notes-sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse sessions', e);
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!activeKeys.current.has(e.code)) {
      activeKeys.current.set(e.code, Date.now());
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const downTime = activeKeys.current.get(e.code);
    if (downTime) {
      const upTime = Date.now();
      const duration = upTime - downTime;
      
      const isCorrection = e.key === 'Backspace' || e.key === 'Delete';
      
      keystrokesRef.current.push({ 
        down: downTime, 
        up: upTime, 
        duration,
        isCorrection 
      });
      activeKeys.current.delete(e.code);
      
      setStats(prev => ({ ...prev, keys: keystrokesRef.current.length }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    const event = { timestamp: Date.now(), length: pastedText.length };
    pastesRef.current.push(event);
    setStats(prev => ({ ...prev, pastes: pastesRef.current.length }));
  };

  const saveSession = () => {
    if (!content.trim()) return;

    const newSession: WritingSession = {
      id: currentSessionId || crypto.randomUUID(),
      title: content.split('\n')[0].substring(0, 30) || 'Untitled Note',
      content,
      createdAt: new Date().toISOString(),
      keystrokes: [...keystrokesRef.current],
      pastes: [...pastesRef.current]
    };

    const updatedSessions = [newSession, ...sessions.filter(s => s.id !== newSession.id)];
    setSessions(updatedSessions);
    localStorage.setItem('vi-notes-sessions', JSON.stringify(updatedSessions));
    
    if (!currentSessionId) {
      setCurrentSessionId(newSession.id);
    }
  };

  const startNewSession = () => {
    setContent('');
    setCurrentSessionId(null);
    keystrokesRef.current = [];
    pastesRef.current = [];
    setStats({ keys: 0, pastes: 0 });
    editorRef.current?.focus();
  };

  const loadSession = (session: WritingSession) => {
    setContent(session.content);
    setCurrentSessionId(session.id);
    keystrokesRef.current = session.keystrokes || [];
    pastesRef.current = session.pastes || [];
    setStats({ 
      keys: keystrokesRef.current.length, 
      pastes: pastesRef.current.length 
    });
    setShowHistory(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('vi-notes-sessions', JSON.stringify(updated));
    if (currentSessionId === id) {
      startNewSession();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-[#E5E5E5]">
      <Header 
        onShowHistory={() => setShowHistory(true)}
        onNewNote={startNewSession}
        onSave={saveSession}
        hasSessions={sessions.length > 0}
        canSave={content.trim().length > 0}
      />

      <Editor 
        content={content}
        onChange={setContent}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        editorRef={editorRef}
      />

      <Footer 
        charCount={content.length}
        keyCount={stats.keys}
        pasteCount={stats.pastes}
      />

      <HistorySidebar 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onAnalyzeSession={setAnalyzingSession}
      />

      <AnalysisModal 
        session={analyzingSession}
        onClose={() => setAnalyzingSession(null)}
      />
    </div>
  );
}
