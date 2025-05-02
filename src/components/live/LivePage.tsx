import React, { useRef, useEffect } from 'react';
import { User, Song } from '../../lib/types';
import { useSocket } from '../../hooks/useSocket';

interface LivePageProps {
  song: Song;
  user: User;
  onEnd: () => void;
}

const LivePage: React.FC<LivePageProps> = ({ song, user, onEnd }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, setIsPlaying, currentTime, setCurrentTime, playSong, pauseSong, seekSong, syncTime } = useSocket();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlay = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      playSong('current-session', audioRef.current.currentTime);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      setIsPlaying(false);
      pauseSong('current-session', audioRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      seekSong('current-session', time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      syncTime('current-session', audioRef.current.currentTime);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Live Session</h1>
        <button
          onClick={onEnd}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          End Session
        </button>
      </div>

      <div className="bg-jamoveo-light p-6 rounded-lg">
        <div className="flex items-center mb-6">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-32 h-32 object-cover rounded mr-6"
          />
          <div>
            <h2 className="text-2xl font-bold text-jamoveo-dark">{song.title}</h2>
            <p className="text-jamoveo-dark/80">{song.artist}</p>
          </div>
        </div>

        <div className="mb-6">
          <audio
            ref={audioRef}
            src={`/songs/${song.id}.mp3`}
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="bg-jamoveo-primary hover:bg-jamoveo-primary/80 text-white px-6 py-2 rounded"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 0}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-jamoveo-dark mb-4">Lyrics</h3>
            <pre className="whitespace-pre-wrap text-jamoveo-dark">{song.lyrics}</pre>
          </div>
          <div>
            <h3 className="text-xl font-bold text-jamoveo-dark mb-4">Chords</h3>
            <pre className="whitespace-pre-wrap text-jamoveo-dark">{song.chords}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage; 