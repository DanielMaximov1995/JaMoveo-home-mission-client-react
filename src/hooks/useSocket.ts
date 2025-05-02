import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Song } from '../lib/types';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinSession = (sessionId: string) => {
    if (!socket) return;
    socket.emit('joinSession', sessionId);
  };

  const selectSong = (sessionId: string, song: Song) => {
    if (!socket) return;
    socket.emit('selectSong', { sessionId, song });
  };

  const playSong = (sessionId: string, time: number) => {
    if (!socket) return;
    socket.emit('playSong', { sessionId, currentTime: time });
  };

  const pauseSong = (sessionId: string, time: number) => {
    if (!socket) return;
    socket.emit('pauseSong', { sessionId, currentTime: time });
  };

  const seekSong = (sessionId: string, time: number) => {
    if (!socket) return;
    socket.emit('seekSong', { sessionId, currentTime: time });
  };

  const syncTime = (sessionId: string, time: number) => {
    if (!socket) return;
    socket.emit('syncTime', { sessionId, currentTime: time });
  };

  const endSession = (sessionId: string) => {
    if (!socket) return;
    socket.emit('endSession', sessionId);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('songSelected', (song: Song) => {
      setCurrentSong(song);
      setIsPlaying(true);
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

    socket.on('sessionEnded', () => {
      setCurrentSong(null);
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      socket.off('songSelected');
      socket.off('playSong');
      socket.off('pauseSong');
      socket.off('seekSong');
      socket.off('syncTime');
      socket.off('sessionEnded');
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
    joinSession,
    selectSong,
    playSong,
    pauseSong,
    seekSong,
    syncTime,
    endSession,
  };
}; 