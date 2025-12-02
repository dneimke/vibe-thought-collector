
import React from 'react';
import { Thought } from '../types';
import Tag from './Tag';

interface ThoughtCardProps {
  thought: Thought;
  onTagClick: (tag: string) => void;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, onTagClick }) => {
  const formattedDate = new Date(thought.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg transition-all hover:border-cyan-500/50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white pr-4">{thought.title}</h3>
        <span className="text-xs text-gray-500 flex-shrink-0">{formattedDate}</span>
      </div>
      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{thought.content}</p>
      <div className="flex flex-wrap gap-2">
        {thought.tags.map(tag => (
          <Tag key={tag} tag={tag} onClick={() => onTagClick(tag)} />
        ))}
      </div>
    </div>
  );
};

export default ThoughtCard;
