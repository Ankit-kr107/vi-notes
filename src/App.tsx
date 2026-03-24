import { useState, type ChangeEvent } from 'react';
import './App.css';

interface TextEditorState {
  text: string;
  wordCount: number;
  charCount: number;
}

function App() {
  const [state, setState] = useState<TextEditorState>({
    text: '',
    wordCount: 0,
    charCount: 0
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setState(prev => ({
      ...prev,
      text: newText,
      wordCount: newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length,
      charCount: newText.length
    }));
  };

  const clearText = () => {
    setState({ text: '', wordCount: 0, charCount: 0 });
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(state.text);
      const btn = document.querySelector('.btn-copy') as HTMLButtonElement;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>✨ Vi Note Text Editor</h1>
        <div className="stats">
          <span>{state.wordCount} words</span>
          <span>{state.charCount} characters</span>
        </div>
      </header>

      <div className="editor-container">
        <textarea
          className="editor"
          value={state.text}
          onChange={handleChange}
          placeholder="Start typing here... Fully typed & error-free!"
          rows={30}
        />
      </div>

      <div className="toolbar">
        <button onClick={clearText} className="btn btn-clear" type="button">
          Clear All
        </button>
        <button onClick={copyText} className="btn btn-copy" type="button">
          Copy Text
        </button>
      </div>
    </div>
  );
}

export default App;