import React from 'react';
import { DailySummary as DailySummaryType } from '../types';
import { StarIcon, StarIconSolid, ArrowPathIcon } from './icons';

interface DailySummaryProps {
  summaryData: DailySummaryType | null;
  isLoading: boolean;
  error: string | null;
  onFavorite: (summary: DailySummaryType) => void;
  isFavorited: boolean;
  onRefresh: () => void;
}

const DailySummary: React.FC<DailySummaryProps> = ({ summaryData, isLoading, error, onFavorite, isFavorited, onRefresh }) => {

  const handleFavoriteClick = () => {
    if (summaryData && !isFavorited) {
      onFavorite(summaryData);
    }
  };

  const renderContent = () => {
    if (isLoading && !summaryData) { // Show loader only on initial load
      return (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    
    if (!summaryData) {
        return <p className="text-center text-gray-500">Add some thoughts to get your first "Thought of the Day".</p>
    }

    return (
      <div>
        <div className="flex justify-between items-start">
            <span className="text-sm font-semibold bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full mb-3 inline-block">
                #{summaryData.theme}
            </span>
             <button
                onClick={handleFavoriteClick}
                disabled={isFavorited}
                className="p-2 -mt-1 -mr-1 rounded-full text-gray-500 hover:text-yellow-400 transition-colors disabled:text-yellow-400 disabled:cursor-not-allowed"
                aria-label={isFavorited ? "Favorited" : "Favorite this insight"}
            >
                {isFavorited ? (
                    <StarIconSolid className="w-6 h-6 text-yellow-400" />
                ) : (
                    <StarIcon className="w-6 h-6" />
                )}
            </button>
        </div>
        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-serif italic">
          "{summaryData.summary}"
        </p>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 min-h-[10rem]">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Thought of the Day</h2>
        <button 
          onClick={onRefresh} 
          className="p-2 text-gray-500 hover:text-cyan-400 rounded-full transition-colors disabled:opacity-50"
          aria-label="Get a new thought"
          disabled={isLoading}
        >
          <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default DailySummary;
