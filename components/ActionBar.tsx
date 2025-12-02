import React from 'react';
import SearchBar from './SearchBar';
import { WandSparklesIcon } from './icons';

interface ActionBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchCommit: (term: string) => void;
  onSynthesizeClick: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ 
  searchTerm, 
  onSearchTermChange,
  onSearchCommit,
  onSynthesizeClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-grow w-full">
        <SearchBar 
            searchTerm={searchTerm} 
            onSearchTermChange={onSearchTermChange}
            onSearchCommit={onSearchCommit}
        />
      </div>
      <button
        onClick={onSynthesizeClick}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors flex-shrink-0"
      >
        <WandSparklesIcon className="w-5 h-5" />
        <span className="sm:inline">Synthesize Insights</span>
      </button>
    </div>
  );
};

export default ActionBar;
