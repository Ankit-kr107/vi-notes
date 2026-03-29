import React from 'react';
import { FileText, Clock } from 'lucide-react';

interface FooterProps {
  charCount: number;
  keyCount: number;
  pasteCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  charCount,
  keyCount,
  pasteCount
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 border-t border-[#EEEEEE] bg-white/80 backdrop-blur-md flex items-center justify-center px-6 gap-8 text-[11px] uppercase tracking-widest text-[#999999] font-medium">
      <div className="flex items-center gap-1.5">
        <FileText size={12} />
        <span>{charCount} characters</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock size={12} />
        <span>{keyCount} events captured</span>
      </div>
      {pasteCount > 0 && (
        <div className="flex items-center gap-1.5 text-orange-500">
          <span>{pasteCount} paste detected</span>
        </div>
      )}
    </footer>
  );
};
