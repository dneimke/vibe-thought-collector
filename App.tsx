import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import Header from './components/Header';
import ThoughtInput from './components/ThoughtInput';
import ThoughtList from './components/ThoughtList';
import ActionBar from './components/ActionBar';
import SynthesizerModal from './components/SynthesizerModal';
import TagCloud from './components/TagCloud';
import DailySummary from './components/DailySummary';
import FavoriteSummariesList from './components/FavoriteSummariesList';
import LoginScreen from './components/LoginScreen';
import { Thought, SynthesisResult, DailySummary as DailySummaryType, FavoriteSummary } from './types';
import { processThought, synthesizeThoughts, generateDailySummary } from './services/geminiService';
import { 
    onAuthStateChangedListener,
    signOutUser,
    addThoughtToFirestore,
    fetchThoughtsFromFirestore,
    addFavoriteToFirestore,
    removeFavoriteFromFirestore,
    fetchFavoritesFromFirestore,
} from './services/firebase';

// A utility to check if we're inside an iframe, like AI Studio
const isInsideIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      // Accessing window.top can throw a cross-origin error in some sandboxed iframes.
      // In that case, we can assume it's an iframe.
      return true;
    }
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [favoriteSummaries, setFavoriteSummaries] = useState<FavoriteSummary[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
    const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [dailySummary, setDailySummary] = useState<DailySummaryType | null>(null);
    const [isDailySummaryLoading, setIsDailySummaryLoading] = useState(true);
    const [dailySummaryError, setDailySummaryError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'home' | 'tags' | 'favorites'>('home');

    // Check for "Demo Mode" when running in an iframe
    const isDemoMode = useMemo(() => isInsideIframe(), []);

    // Handle Auth State and Data Loading
    useEffect(() => {
        if (isDemoMode) {
            console.log("Running in Demo Mode. Bypassing Firebase Auth and using localStorage.");
            // Load from local storage
            try {
                const localThoughts = JSON.parse(localStorage.getItem('thoughts_demo') || '[]');
                const localFavorites = JSON.parse(localStorage.getItem('favorites_demo') || '[]');
                setThoughts(localThoughts);
                setFavoriteSummaries(localFavorites);
            } catch (e) {
                console.error("Failed to load data from local storage", e);
                // In case of parsing error, start fresh
                setThoughts([]);
                setFavoriteSummaries([]);
            }
            setIsAuthLoading(false);
            setIsDataLoading(false);
            return; // Don't run Firebase auth listener
        }

        const unsubscribe = onAuthStateChangedListener(async (user) => {
            setUser(user);
            if (user) {
                setIsDataLoading(true);
                // Fetch all user data in parallel
                try {
                    const [fetchedThoughts, fetchedFavorites] = await Promise.all([
                        fetchThoughtsFromFirestore(user.uid),
                        fetchFavoritesFromFirestore(user.uid),
                    ]);
                    setThoughts(fetchedThoughts);
                    setFavoriteSummaries(fetchedFavorites);
                } catch (err: any) {
                    console.error("Failed to fetch user data", err);
                    if (err.code === 'unavailable' || (err.message && err.message.includes('offline'))) {
                         setError("Could not connect to the database. This might be due to a network issue or a project configuration problem. Please check your internet connection and ensure your Firebase project has the Cloud Firestore API enabled.");
                    } else {
                        setError("Could not load your data. Please try refreshing the page.");
                    }
                } finally {
                    setIsDataLoading(false);
                }
            } else {
                // Clear all data on sign-out
                setThoughts([]);
                setFavoriteSummaries([]);
                setIsDataLoading(false);
            }
            setIsAuthLoading(false);
        });
        return unsubscribe;
    }, [isDemoMode]);

    // Persist data to localStorage in Demo Mode
    useEffect(() => {
        if (isDemoMode && !isDataLoading) {
            try {
                localStorage.setItem('thoughts_demo', JSON.stringify(thoughts));
                localStorage.setItem('favorites_demo', JSON.stringify(favoriteSummaries));
            } catch (e) {
                console.error("Failed to save data to local storage", e);
            }
        }
    }, [isDemoMode, thoughts, favoriteSummaries, isDataLoading]);

    const tagCloudData = useMemo(() => {
        const tagCounts: { [key: string]: number } = {};
        thoughts.forEach(thought => {
          thought.tags.forEach(tag => {
            const lowerCaseTag = tag.toLowerCase();
            tagCounts[lowerCaseTag] = (tagCounts[lowerCaseTag] || 0) + 1;
          });
        });
        return Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count);
    }, [thoughts]);

    const fetchDailySummary = useCallback(async (excludeTheme?: string) => {
        if (thoughts.length === 0) {
          setDailySummary(null);
          setIsDailySummaryLoading(false);
          return;
        }
        
        setIsDailySummaryLoading(true);
        setDailySummaryError(null);
        try {
          const availableTags = tagCloudData.filter(t => t.tag !== excludeTheme);
          const tagsToUse = availableTags.length > 0 ? availableTags : tagCloudData;
          const topTags = tagsToUse.slice(0, 5);
          const theme = topTags[Math.floor(Math.random() * topTags.length)]?.tag;
    
          if (!theme) {
              setIsDailySummaryLoading(false);
              return;
          }
    
          const relatedThoughts = thoughts.filter(t => t.tags.some(tag => tag.toLowerCase() === theme.toLowerCase()));
          const summary = await generateDailySummary(theme, relatedThoughts);
          setDailySummary(summary);
        } catch (err) {
          console.error("Failed to generate daily summary", err);
          setDailySummaryError("Could not generate a Thought of the Day. Please try again later.");
        } finally {
          setIsDailySummaryLoading(false);
        }
    }, [thoughts, tagCloudData]);
    
    useEffect(() => {
        // Only fetch summary if data has loaded (user check is irrelevant for demo mode)
        if (!isDataLoading) {
            fetchDailySummary();
        }
    }, [fetchDailySummary, isDataLoading]);

    const handleRefreshDailySummary = useCallback(() => {
        fetchDailySummary(dailySummary?.theme);
    }, [dailySummary, fetchDailySummary]);

    const handleAddThought = async (content: string) => {
        setIsLoading(true);
        setError(null);
        try {
          const processed = await processThought(content);
          const newThought: Thought = {
            ...processed,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          setThoughts(prev => [newThought, ...prev]);
          if (!isDemoMode && user) {
            await addThoughtToFirestore(user.uid, newThought);
          }
        } catch (err) {
          console.error(err);
          setError("Failed to process your thought. Please try again.");
        } finally {
          setIsLoading(false);
        }
    };
    
    const handleSynthesize = async (query: string) => {
        setIsLoading(true);
        setError(null);
        setSynthesisResult(null);
        try {
          const result = await synthesizeThoughts(query, thoughts);
          setSynthesisResult(result);
        } catch (err) {
          console.error(err);
          setError("Failed to synthesize your thoughts. Please try again.");
        } finally {
          setIsLoading(false);
        }
    };

    const openSynthesizer = useCallback(() => {
        setIsSynthesizerOpen(true);
        setError(null);
        setSynthesisResult(null);
    }, []);

    const handleSearchCommit = (term: string) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) {
          setActiveFilter('');
          setSearchTerm('');
          return;
        }
    
        setActiveFilter(trimmedTerm);
        setActiveView('home');
    };
    
    const handleTagClick = (tag: string) => {
        const newFilter = `#${tag}`;
        setActiveFilter(newFilter);
        setSearchTerm(newFilter);
        setActiveView('home');
    };

    const handleFavoriteSummary = async (summaryToFavorite: DailySummaryType) => {
        const isFavorited = favoriteSummaries.some(fav => fav.summary === summaryToFavorite.summary && fav.theme === summaryToFavorite.theme);
        if (!isFavorited) {
            const newFavorite: FavoriteSummary = {
                ...summaryToFavorite,
                id: Date.now().toString(),
                favoritedAt: new Date().toISOString()
            };
            setFavoriteSummaries(prev => [newFavorite, ...prev]);
            if (!isDemoMode && user) {
                await addFavoriteToFirestore(user.uid, newFavorite);
            }
        }
    };
    
    const handleUnfavoriteSummary = async (id: string) => {
        setFavoriteSummaries(prev => prev.filter(fav => fav.id !== id));
        if (!isDemoMode && user) {
            await removeFavoriteFromFirestore(user.uid, id);
        }
    };

    const isCurrentSummaryFavorited = useMemo(() => {
        if (!dailySummary) return false;
        return favoriteSummaries.some(fav => fav.summary === dailySummary.summary && fav.theme === dailySummary.theme);
      }, [dailySummary, favoriteSummaries]);

    const filteredThoughts = useMemo(() => {
        if (!activeFilter.trim()) return thoughts;
        const filterLower = activeFilter.toLowerCase();
        if (filterLower.startsWith('#')) {
          const tag = filterLower.substring(1);
          return thoughts.filter(thought => thought.tags.some(t => t.toLowerCase().includes(tag)));
        }
        return thoughts.filter(thought => 
          thought.title.toLowerCase().includes(filterLower) ||
          thought.content.toLowerCase().includes(filterLower)
        );
    }, [thoughts, activeFilter]);

    const renderActiveView = () => {
        switch (activeView) {
            case 'tags':
                return (
                    <div className="max-w-4xl mx-auto">
                         <h2 className="text-2xl font-bold text-white mb-4 text-center">Explore Your Tags</h2>
                         <TagCloud tags={tagCloudData.slice(0, 50)} onTagClick={handleTagClick} />
                    </div>
                );
            case 'favorites':
                return (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Favorite Insights</h2>
                        <FavoriteSummariesList favorites={favoriteSummaries} onUnfavorite={handleUnfavoriteSummary} />
                    </div>
                );
            case 'home':
            default:
                return (
                    <div className="max-w-4xl mx-auto">
                        {activeFilter ? (
                          <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-white">Filtered Thoughts</h2>
                                <button onClick={() => { setActiveFilter(''); setSearchTerm(''); }} className="text-sm text-cyan-400 hover:text-cyan-300">Clear Filter</button>
                            </div>
                            <ThoughtList thoughts={filteredThoughts} onTagClick={handleTagClick} />
                          </>
                        ) : (
                          <DailySummary
                            summaryData={dailySummary}
                            isLoading={isDailySummaryLoading}
                            error={dailySummaryError}
                            onFavorite={handleFavoriteSummary}
                            isFavorited={isCurrentSummaryFavorited}
                            onRefresh={handleRefreshDailySummary}
                          />
                        )}
                    </div>
                );
        }
    }

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user && !isDemoMode) {
        return <LoginScreen />;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
          {isDemoMode && (
            <div className="bg-yellow-600/30 border-b border-yellow-700 text-yellow-200 text-center p-2 text-sm shadow-lg sticky top-0 z-10">
                <strong>Demo Mode:</strong> Your thoughts are stored locally in this browser and will not be synced.
            </div>
          )}
          <main className="container mx-auto max-w-7xl p-4 md:p-8">
            <Header 
              user={user} 
              onSignOut={signOutUser}
              activeView={activeView}
              onViewChange={setActiveView}
            />
            
            {isDataLoading ? (
                <div className="flex items-center justify-center pt-24">
                    <div className="w-10 h-10 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                    <p className="ml-4 text-lg text-gray-300">Loading your thoughts...</p>
                </div>
            ) : (
                <>
                <div className="mb-6 max-w-4xl mx-auto">
                  <ThoughtInput onSubmit={handleAddThought} isLoading={isLoading} />
                </div>
        
                <div className="mb-8 max-w-4xl mx-auto">
                  <ActionBar 
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    onSearchCommit={handleSearchCommit}
                    onSynthesizeClick={openSynthesizer}
                  />
                </div>
                
                {error && !isSynthesizerOpen && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg my-4 max-w-4xl mx-auto" role="alert">
                      <p>{error}</p>
                    </div>
                )}
        
                <div className="mt-8">
                    {renderActiveView()}
                </div>
                </>
            )}
            
            <SynthesizerModal
              isOpen={isSynthesizerOpen}
              onClose={() => setIsSynthesizerOpen(false)}
              onSynthesize={handleSynthesize}
              isLoading={isLoading}
              result={synthesisResult}
              error={error}
              thoughts={thoughts}
            />
    
          </main>
        </div>
      );
};

export default App;
