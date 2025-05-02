import React from 'react';
import { Song } from '../../lib/types';
import { StopCircle } from 'lucide-react';

interface LiveSongDisplayProps {
  song: Song;
  onStop: () => void;
}

const renderLyricsChordsBlock = (song: Song) => {
  try {
    const raw = require(`../../songs/${song.id.replace(/-/g, '_')}.json`);
    return (
      <div className="text-xl md:text-2xl font-medium text-right">
        {raw.map((verse: any, i: number) => (
          <div key={i} className="mb-4 flex flex-col gap-y-2">
            <div className="flex flex-row flex-wrap items-end justify-end gap-x-2">
              {verse.map((line: any, j: number) => (
                <span
                  key={j}
                  className="inline-flex flex-col items-center min-w-[2.5ch] text-center"
                >
                  {line.chords && (
                    <span className="text-jamoveo-primary block capitalize leading-tight text-base md:text-lg font-bold">
                      {line.chords}
                    </span>
                  )}
                  <span className="text-black block leading-tight">{line.lyrics}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return (
      <pre className="text-xl md:text-2xl font-medium text-right">
        {song.lyrics}
      </pre>
    );
  }
}

const LiveSongDisplay: React.FC<LiveSongDisplayProps> = ({ song, onStop }) => (
  <div className="mb-8 p-4 bg-white border rounded-lg shadow text-center">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <img
          src={song.imageUrl || '/images/song-placeholder.png'}
          alt={song.title}
          className="w-16 h-16 rounded object-cover"
        />
        <div className="flex-1 text-right">
          <h3 className="text-lg font-semibold text-gray-900">{song.title}</h3>
          <p className="text-gray-600">{song.artist}</p>
        </div>
      </div>
      <button
        onClick={onStop}
        className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300 text-red-600 font-bold"
        title="Stop"
      >
        <StopCircle size={28} />
      </button>
    </div>
    <div className="border rounded-lg p-6 bg-[#fafafa] overflow-x-auto">
      {renderLyricsChordsBlock(song)}
    </div>
  </div>
);

export default LiveSongDisplay; 