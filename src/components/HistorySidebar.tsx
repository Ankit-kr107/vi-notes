import React from 'react';
import { History, Trash2, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WritingSession } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: WritingSession[];
  currentSessionId: string | null;
  onLoadSession: (session: WritingSession) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onAnalyzeSession: (session: WritingSession) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onLoadSession,
  onDeleteSession,
  onAnalyzeSession
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-20"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white border-l border-[#EEEEEE] z-30 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-[#EEEEEE] flex items-center justify-between">
              <h2 className="text-lg font-semibold">Writing History</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#F5F5F5] rounded-full"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-[#CCCCCC]">
                  <History size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No saved sessions yet</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onLoadSession(session)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      currentSessionId === session.id
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                        : 'bg-white border-[#EEEEEE] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm truncate pr-4">
                        {session.title}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnalyzeSession(session);
                          }}
                          className={`p-1 rounded-md transition-opacity ${
                            currentSessionId === session.id
                              ? 'hover:bg-white/20 text-white/60'
                              : 'hover:bg-blue-50 text-blue-500'
                          }`}
                          title="Analyze"
                        >
                          <Clock size={14} />
                        </button>
                        <button
                          onClick={(e) => onDeleteSession(session.id, e)}
                          className={`p-1 rounded-md transition-opacity ${
                            currentSessionId === session.id
                              ? 'hover:bg-white/20 text-white/60'
                              : 'hover:bg-red-50 text-red-400'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-[10px] uppercase tracking-wider opacity-60`}>
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
