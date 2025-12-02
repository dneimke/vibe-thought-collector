import React from 'react';
import { HomeIcon, TagIcon, StarIcon } from './icons';

type View = 'home' | 'tags' | 'favorites';

interface NavigationProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);


const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
    return (
        <nav className="bg-gray-800/50 p-2 rounded-lg border border-gray-700 flex items-center justify-around gap-2 max-w-md mx-auto">
            <NavButton
                icon={<HomeIcon className="w-6 h-6" />}
                label="Home"
                isActive={activeView === 'home'}
                onClick={() => onViewChange('home')}
            />
            <NavButton
                icon={<TagIcon className="w-6 h-6" />}
                label="Tags"
                isActive={activeView === 'tags'}
                onClick={() => onViewChange('tags')}
            />
            <NavButton
                icon={<StarIcon className="w-6 h-6" />}
                label="Favorites"
                isActive={activeView === 'favorites'}
                onClick={() => onViewChange('favorites')}
            />
        </nav>
    );
};

export default Navigation;
