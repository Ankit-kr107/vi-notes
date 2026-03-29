import React from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onKeyDown,
  onKeyUp,
  onPaste,
  editorRef
}) => {
  return (
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPaste={onPaste}
        placeholder="Start writing your thoughts..."
        className="w-full min-h-[60vh] text-xl leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-[#CCCCCC]"
        spellCheck={false}
        autoFocus
      />
    </main>
  );
};
