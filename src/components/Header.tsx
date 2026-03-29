import React from 'react';
import { Save, History, Plus } from 'lucide-react';

interface HeaderProps {
  onShowHistory: () => void;
  onNewNote: () => void;
  onSave: () => void;
  hasSessions: boolean;
  canSave: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onShowHistory,
  onNewNote,
  onSave,
  hasSessions,
  canSave
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-[#EEEEEE] bg-white/80 backdrop-blur-md z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">V</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Vi-Note</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onShowHistory}
          className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors relative"
          title="History"
        >
          <History size={20} />
          {hasSessions && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>
        <button
          onClick={onNewNote}
          className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors"
          title="New Note"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333333] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span className="text-sm font-medium">Save</span>
        </button>
      </div>
    </header>
  );
};
