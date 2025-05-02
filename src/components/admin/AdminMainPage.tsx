import React, { useState, useEffect } from 'react';
import { User, Song } from '../../lib/types';
import Logo from '../logo';
import { useSocket } from '../../hooks/useSocket';
import { searchSongs, loadSongs } from '../../services/songService';
import LiveSongDisplay from './LiveSongDisplay';
import SongList from './SongList';
import { Search, User as UserIcon } from 'lucide-react';

interface AdminMainPageProps {
  user: User;
  onSelectSong: (song: Song) => void;
  onLogout: () => void;
}

const AdminMainPage: React.FC<AdminMainPageProps> = ({ user, onSelectSong, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useSocket();

  useEffect(() => {
    const loadInitialSongs = async () => {
      const songs = await searchSongs('');
      setSearchResults(songs);
    };
    loadInitialSongs();
  }, []);

  const handleSearch = async (query: string) => {
    const results = await searchSongs(query);
    setSearchResults(results);
  };

  const handleSelectSong = (song: Song) => {
    onSelectSong(song);
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleStopSong = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-jamoveo-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-full bg-[#ececec] hover:bg-[#e0e0e0] transition-colors border border-gray-300"
          >
            <UserIcon size={28} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}>
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search any song..."
                className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-jamoveo-primary shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-jamoveo-primary"
                tabIndex={-1}
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Currently Playing */}
        {currentSong && isPlaying && (
          <LiveSongDisplay song={currentSong} onStop={handleStopSong} />
        )}

        {/* Song List */}
        <h2 className="text-gray-800 text-lg font-semibold mb-4">
          {searchQuery ? 'Search Results' : 'Recommended song list'}
        </h2>
        <SongList songs={searchResults} onPlay={handlePlaySong} />
      </main>
    </div>
  );
};

export default AdminMainPage; 