import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Song } from '../lib/types';

interface User {
  userId: string;
  username: string;
}

interface SessionState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  users: User[];
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server');
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinSession = (sessionId: string) => {
    if (!socket) return;
    setError(null);
    socket.emit('joinSession', sessionId);
  };

  const selectSong = (sessionId: string, song: Song) => {
    if (!socket) return;
    setError(null);
    socket.emit('selectSong', { sessionId, song });
  };

  const playSong = (sessionId: string, time: number) => {
    if (!socket) return;
    setError(null);
    socket.emit('playSong', { sessionId, currentTime: time });
  };

  const pauseSong = (sessionId: string, time: number) => {
    if (!socket) return;
    setError(null);
    socket.emit('pauseSong', { sessionId, currentTime: time });
  };

  const seekSong = (sessionId: string, time: number) => {
    if (!socket) return;
    setError(null);
    socket.emit('seekSong', { sessionId, currentTime: time });
  };

  const syncTime = (sessionId: string, time: number) => {
    if (!socket) return;
    setError(null);
    socket.emit('syncTime', { sessionId, currentTime: time });
  };

  const endSession = (sessionId: string) => {
    if (!socket) return;
    setError(null);
    socket.emit('endSession', sessionId);
  };

  useEffect(() => {
    if (!socket) return;

    // Handle initial session state
    socket.on('sessionState', (state: SessionState) => {
      setCurrentSong(state.currentSong);
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.currentTime);
      setConnectedUsers(state.users);
    });

    socket.on('songSelected', ({ song, selectedBy }) => {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      console.log(`Song selected by ${selectedBy}`);
    });

    socket.on('playSong', ({ currentTime: time }) => {
      setIsPlaying(true);
      setCurrentTime(time);
    });

    socket.on('pauseSong', ({ currentTime: time }) => {
      setIsPlaying(false);
      setCurrentTime(time);
    });

    socket.on('seekSong', ({ currentTime: time }) => {
      setCurrentTime(time);
    });

    socket.on('syncTime', ({ currentTime: time }) => {
      setCurrentTime(time);
    });

    socket.on('sessionEnded', ({ endedBy }) => {
      setCurrentSong(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setConnectedUsers([]);
      console.log(`Session ended by ${endedBy}`);
    });

    // Handle user presence
    socket.on('userJoined', ({ userId, username }) => {
      setConnectedUsers(prev => [...prev, { userId, username }]);
      console.log(`User joined: ${username}`);
    });

    socket.on('userLeft', ({ userId, username }) => {
      setConnectedUsers(prev => prev.filter(user => user.userId !== userId));
      console.log(`User left: ${username}`);
    });

    return () => {
      socket.off('sessionState');
      socket.off('songSelected');
      socket.off('playSong');
      socket.off('pauseSong');
      socket.off('seekSong');
      socket.off('syncTime');
      socket.off('sessionEnded');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('error');
      socket.off('connect_error');
    };
  }, [socket]);

  return {
    socket,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    connectedUsers,
    error,
    joinSession,
    selectSong,
    playSong,
    pauseSong,
    seekSong,
    syncTime,
    endSession,
  };
}; 