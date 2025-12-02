import React from 'react';

interface RecentSearchesProps {
  searches: string[];
  onSearchClick: (term: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSearchClick }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-center text-white mb-4">Recent Searches</h3>
        <div className="flex flex-wrap justify-center gap-2">
            {searches.map((term) => (
                <button
                    key={term}
                    onClick={() => onSearchClick(term)}
                    className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-600 hover:text-white transition-colors"
                >
                    {term}
                </button>
            ))}
        </div>
    </div>
  );
};

export default RecentSearches;
