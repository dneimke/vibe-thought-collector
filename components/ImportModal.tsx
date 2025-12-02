import React, { useState } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (text: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  isLoading,
  error,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onImport(text);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 id="import-title" className="text-xl font-bold text-white">Import Your Notes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </header>

        <div className="p-6 overflow-y-auto">
            <div className="prose prose-invert prose-sm text-gray-400 bg-gray-900/50 p-4 rounded-lg mb-4">
                <p>Easily import your thoughts from other apps (like Apple Notes).</p>
                <ol>
                    <li>In your notes app, select and copy the notes you want to import.</li>
                    <li>Paste the copied text into the text area below.</li>
                    <li>The AI will automatically split, title, and tag each note for you.</li>
                </ol>
            </div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your copied notes here..."
              className="w-full h-48 p-3 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-200 resize-vertical"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Importing...</span>
                </>
              ) : (
                'Import Notes'
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mt-4" role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
