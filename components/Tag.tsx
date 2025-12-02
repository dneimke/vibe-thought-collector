
import React from 'react';

interface TagProps {
  tag: string;
  onClick: () => void;
}

const Tag: React.FC<TagProps> = ({ tag, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-cyan-900/80 transition-colors cursor-pointer"
    >
      #{tag}
    </button>
  );
};

export default Tag;
