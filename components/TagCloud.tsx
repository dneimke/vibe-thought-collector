import React from 'react';

interface TagCloudProps {
  tags: { tag: string; count: number }[];
  onTagClick: (tag:string) => void;
}

const getTagSizeClass = (count: number, minCount: number, maxCount: number): string => {
  if (count === maxCount && maxCount > minCount) return 'text-2xl font-bold';
  if (maxCount - minCount <= 0) return 'text-base';

  const percentage = (count - minCount) / (maxCount - minCount);

  if (percentage > 0.75) return 'text-xl font-semibold';
  if (percentage > 0.5) return 'text-lg';
  if (percentage > 0.25) return 'text-base';
  return 'text-sm';
};

const TagCloud: React.FC<TagCloudProps> = ({ tags, onTagClick }) => {
  if (tags.length === 0) {
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400">Your tag cloud will appear here once you've added some thoughts.</p>
        </div>
    );
  }
  
  const counts = tags.map(t => t.count);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            {tags.map(({ tag, count }) => (
                <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className={`transition-all duration-200 ease-in-out hover:scale-110 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1 ${getTagSizeClass(count, minCount, maxCount)} text-gray-400`}
                    aria-label={`Filter by tag: ${tag}`}
                >
                    {tag}
                </button>
            ))}
        </div>
    </div>
  );
};

export default TagCloud;
