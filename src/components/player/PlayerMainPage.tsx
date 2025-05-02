import React from 'react';
import { User, Song } from '../../lib/types';
import Logo from '../logo';
import LiveSongDisplay from '../admin/LiveSongDisplay';
import { Music } from 'lucide-react';

interface PlayerMainPageProps {
  user: User;
  currentSong: Song | null;
  onLogout: () => void;
}

const PlayerMainPage: React.FC<PlayerMainPageProps> = ({ user, currentSong, onLogout }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-jamoveo-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user.username} ({user.instrument})
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-jamoveo-primary text-white rounded-jamoveo hover:bg-jamoveo-accent transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentSong ? (
          <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <Music size={48} className="text-jamoveo-primary mb-4" />
            <span className="text-2xl text-gray-700 font-medium">Waiting for next song...</span>
          </div>
        ) : (
          <LiveSongDisplay song={currentSong} onStop={() => {}} />
        )}
      </main>
    </div>
  );
};

export default PlayerMainPage; 