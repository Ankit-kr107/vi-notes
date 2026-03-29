import React from 'react';
import { FileText, Clock, Save, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WritingSession } from '../types';
import { calculateMetrics, formatDuration } from '../utils/metrics';

interface AnalysisModalProps {
  session: WritingSession | null;
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  session,
  onClose
}) => {
  if (!session) return null;

  const metrics = calculateMetrics(session);

  return (
    <AnimatePresence>
      {session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-[#EEEEEE] flex items-center justify-between bg-[#F9F9F9]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Session Analysis</h2>
                <p className="text-sm text-[#999999] mt-1">
                  {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white border border-[#EEEEEE] rounded-full flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Core Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Words', value: metrics.words, icon: <FileText size={16} /> },
                  { label: 'Characters', value: metrics.chars, icon: <FileText size={16} /> },
                  { label: 'Keystrokes', value: metrics.keys, icon: <Clock size={16} /> },
                  { label: 'Pastes', value: metrics.pastes, icon: <Save size={16} /> },
                  { label: 'Duration', value: formatDuration(metrics.durationMs), icon: <Clock size={16} /> },
                  { label: 'Created', value: new Date(session.createdAt).toLocaleDateString(), icon: <Clock size={16} /> },
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-[#F9F9F9] rounded-2xl border border-[#EEEEEE]">
                    <div className="flex items-center gap-2 text-[#999999] mb-2">
                      {stat.icon}
                      <span className="text-[10px] uppercase tracking-widest font-bold">{stat.label}</span>
                    </div>
                    <div className="text-xl font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Behavioral Metrics Box */}
              <div className="p-8 bg-[#1A1A1A] text-white rounded-[24px] shadow-xl">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Behavioral Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 opacity-60">
                        <span>Correction Rate</span>
                        <span>{metrics.correctionRate}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.correctionRate}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Est. WPM</p>
                        <p className="text-3xl font-bold">{metrics.wpm}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Burst Speed</p>
                        <p className="text-3xl font-bold">{metrics.maxBurstWpm || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-white/10 pl-8 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Long Pauses</span>
                      <span className="font-mono">{metrics.longPauses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Avg. Dwell Time</span>
                      <span className="font-mono">{metrics.avgDwell}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Typing Consistency</span>
                      <span className="font-mono">
                        {metrics.longPauses > 5 ? 'Variable' : 'Steady'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Input Method</span>
                      <span className="font-mono">
                        {metrics.pastes > 0 ? 'Mixed' : 'Pure Typing'}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-30 mt-4 italic">
                      * Dwell time measures the average duration a key is held down. Consistency is derived from pause frequency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
