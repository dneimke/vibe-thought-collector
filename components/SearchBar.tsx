import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchCommit: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange, onSearchCommit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchCommit(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Filter thoughts by keyword or #tag..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="w-full p-3 pl-4 pr-12 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-gray-200"
      />
      <button 
        type="submit" 
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 text-gray-300" />
      </button>
    </form>
  );
};

export default SearchBar;
