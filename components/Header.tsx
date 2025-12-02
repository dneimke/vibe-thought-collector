import React from 'react';
import { BrainCircuitIcon, HomeIcon, StarIcon, TagIcon } from './icons';
import { User } from 'firebase/auth';

type View = 'home' | 'tags' | 'favorites';

interface HeaderProps {
    user?: User | null;
    onSignOut?: () => void;
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
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="hidden sm:inline font-medium text-sm">{label}</span>
    </button>
);


const Header: React.FC<HeaderProps> = ({ user, onSignOut, activeView, onViewChange }) => {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
        {/* Left Section: App Title */}
        <div className="flex-1 flex items-center justify-start gap-3">
            <BrainCircuitIcon className="w-9 h-9 text-cyan-400 flex-shrink-0" />
            <h1 className="hidden md:block text-xl font-bold text-white tracking-tight">
                Thought Collector
            </h1>
        </div>

        {/* Center Section: Navigation */}
        <nav className="flex items-center justify-center gap-1 p-1 bg-gray-800 rounded-xl border border-gray-700">
             <NavButton
                icon={<HomeIcon className="w-5 h-5" />}
                label="Home"
                isActive={activeView === 'home'}
                onClick={() => onViewChange('home')}
            />
            <NavButton
                icon={<TagIcon className="w-5 h-5" />}
                label="Tags"
                isActive={activeView === 'tags'}
                onClick={() => onViewChange('tags')}
            />
            <NavButton
                icon={<StarIcon className="w-5 h-5" />}
                label="Favorites"
                isActive={activeView === 'favorites'}
                onClick={() => onViewChange('favorites')}
            />
        </nav>

        {/* Right Section: User Info & Sign Out */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {user && onSignOut ? (
            <>
                {user.photoURL && (
                    <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User avatar'} 
                        className="w-10 h-10 rounded-full" 
                    />
                )}
                <button
                    onClick={onSignOut}
                    className="hidden lg:block bg-gray-700 hover:bg-red-600/50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Sign Out
                </button>
            </>
          ) : <div className="w-10 h-10" /> /* Placeholder to maintain balance */}
        </div>
    </header>
  );
};

export default Header;
