import React from 'react';
import { FavoriteSummary } from '../types';
import { TrashIcon } from './icons';

interface FavoriteSummariesListProps {
  favorites: FavoriteSummary[];
  onUnfavorite: (id: string) => void;
}

const FavoriteSummariesList: React.FC<FavoriteSummariesListProps> = ({ favorites, onUnfavorite }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      {favorites.length > 0 ? (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li key={fav.id} className="bg-gray-800 p-4 rounded-lg relative">
              <span className="text-xs font-semibold bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded-full mb-2 inline-block">
                #{fav.theme}
              </span>
              <p className="text-gray-300 italic text-sm">"{fav.summary}"</p>
              <button
                onClick={() => onUnfavorite(fav.id)}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 rounded-full transition-colors"
                aria-label="Unfavorite this insight"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-sm">Your favorite daily insights will appear here.</p>
      )}
    </div>
  );
};

export default FavoriteSummariesList;
