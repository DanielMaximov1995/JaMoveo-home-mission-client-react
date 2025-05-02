import React, { useEffect, useState } from 'react';
import { User, Song, SearchResult } from './lib/types';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import PlayerMainPage from './components/player/PlayerMainPage';
import AdminMainPage from './components/admin/AdminMainPage';
import LivePage from './components/live/LivePage';
import { useSocket } from './hooks/useSocket';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const { user, logout } = useAuth();
  const { currentSong, setCurrentSong, isPlaying, setIsPlaying, socket } = useSocket();

  useEffect(() => {
    if (user) {
      setCurrentPage(user.isAdmin ? 'admin' : 'player');
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on('songSelected', (song: Song) => {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentPage('live');
    });
    socket.on('sessionEnded', () => {
      setCurrentSong(null);
      setIsPlaying(false);
      setCurrentPage(user?.isAdmin ? 'admin' : 'player');
    });
    return () => {
      socket.off('songSelected');
      socket.off('sessionEnded');
    };
  }, [socket, setCurrentSong, setIsPlaying, user]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    logout();
    setCurrentSong(null);
    setIsPlaying(false);
    navigateTo('login');
  };

  const handleSelectSong = (song: SearchResult) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentPage('live');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentPage === 'login' && <LoginPage navigateTo={navigateTo} />}
      {currentPage === 'register' && <RegisterPage navigateTo={navigateTo} />}
      {currentPage === 'player' && user && (
        <PlayerMainPage 
          user={user}
          currentSong={currentSong}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'admin' && user && (
        <AdminMainPage 
          user={user}
          onLogout={handleLogout}
          onSelectSong={handleSelectSong}
        />
      )}
      {currentPage === 'live' && currentSong && user && (
        <LivePage
          song={currentSong}
          user={user}
          onEnd={() => {
            setCurrentPage(user.isAdmin ? 'admin' : 'player');
            setCurrentSong(null);
            setIsPlaying(false);
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 