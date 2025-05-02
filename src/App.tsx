import React, { useEffect, useState } from 'react';
import { User, Song, SearchResult } from './lib/types';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import PlayerMainPage from './components/player/PlayerMainPage';
import AdminMainPage from './components/admin/AdminMainPage';
import LivePage from './components/live/LivePage';
import { useSocket } from './hooks/useSocket';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState<User | null>(null);
  const { currentSong, setCurrentSong, isPlaying, setIsPlaying, socket } = useSocket();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setCurrentPage(parsedUser.role === 'admin' ? 'admin' : 'player');
    }
  }, [setCurrentSong]);

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
      setCurrentPage(user?.role === 'admin' ? 'admin' : 'player');
    });
    return () => {
      socket.off('songSelected');
      socket.off('sessionEnded');
    };
  }, [socket, setCurrentSong, setIsPlaying, user]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'player');
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    setUser(null);
    setCurrentSong(null);
    setIsPlaying(false);
    localStorage.removeItem('user');
    navigateTo('login');
  };

  const handleSelectSong = (song: SearchResult) => {
    // In a real application, this would fetch the full song data
    const mockSong: Song = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      lyrics: 'Example lyrics...\nLine 1\nLine 2\nLine 3',
      chords: 'Example chords...\nC G Am F\nC G Am F',
      imageUrl: song.imageUrl,
    };
    setCurrentSong(mockSong);
    setIsPlaying(true);
    if (socket) {
      socket.emit('selectSong', { sessionId: 'current-session', song: mockSong });
    }
    navigateTo('live');
  };

  const handleEndLive = () => {
    if (socket) {
      socket.emit('endSession', 'current-session');
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentPage(user?.role === 'admin' ? 'admin' : 'player');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'register':
        return <RegisterPage onRegister={handleLogin} navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'player':
        return <PlayerMainPage user={user!} currentSong={currentSong} onLogout={handleLogout} />;
      case 'admin':
        return <AdminMainPage user={user!} onSelectSong={handleSelectSong} onLogout={handleLogout} />;
      case 'live':
        return <LivePage song={currentSong!} user={user!} onEnd={handleEndLive} />;
      default:
        return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-jamoveo-dark text-jamoveo-light font-sans">
      {renderPage()}
    </div>
  );
};

export default App; 