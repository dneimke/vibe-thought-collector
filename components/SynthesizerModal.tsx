import React, { useState, useMemo, useEffect } from 'react';
import { Thought, SynthesisResult } from '../types';
import ThoughtCard from './ThoughtCard';

interface SynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynthesize: (query: string) => void;
  isLoading: boolean;
  result: SynthesisResult | null;
  error: string | null;
  thoughts: Thought[];
}

const SynthesizerModal: React.FC<SynthesizerModalProps> = ({
  isOpen,
  onClose,
  onSynthesize,
  isLoading,
  result,
  error,
  thoughts,
}) => {
  const [query, setQuery] = useState('');

  // Effect to clear the query when the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const sourceThoughts = useMemo(() => {
    if (!result) return [];
    return result.sourceIds
      .map(id => thoughts.find(t => t.id === id))
      .filter((t): t is Thought => t !== undefined);
  }, [result, thoughts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSynthesize(query);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="synthesizer-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 id="synthesizer-title" className="text-xl font-bold text-white">Synthesize My Thoughts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <label htmlFor="synthesis-query" className="block text-sm font-medium text-gray-300 mb-2">Ask a question about your thoughts:</label>
            <textarea
              id="synthesis-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., What are my main principles for effective coaching?"
              className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-200 resize-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Synthesizing...</span>
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mt-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">AI Summary:</h3>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{result.summary}</p>
              </div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-2">Sources:</h3>
              <div className="space-y-4">
                {sourceThoughts.map(thought => (
                  <ThoughtCard key={thought.id} thought={thought} onTagClick={() => {}} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynthesizerModal;
