
import React from 'react';
import { Thought } from '../types';
import ThoughtCard from './ThoughtCard';

interface ThoughtListProps {
  thoughts: Thought[];
  onTagClick: (tag: string) => void;
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts, onTagClick }) => {
  if (thoughts.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg mt-4">
        <p className="text-gray-400 text-lg">Your collected thoughts will appear here.</p>
        <p className="text-gray-500">Try typing or using the microphone to capture an idea.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thoughts.map(thought => (
        <ThoughtCard key={thought.id} thought={thought} onTagClick={onTagClick} />
      ))}
    </div>
  );
};

export default ThoughtList;
