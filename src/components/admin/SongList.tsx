import React from 'react';
import { Song } from '../../lib/types';
import { PlayCircle } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  onPlay: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, onPlay }) => (
  <div>
    <div className="space-y-2">
      {songs.length > 0 ? (
        songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between bg-[#f5f3ed] rounded-lg px-4 py-3 hover:bg-[#ece8df] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={song.imageUrl || '/images/song-placeholder.png'}
                alt={song.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="truncate">
                <span className="block text-gray-900 font-medium truncate">{song.title}</span>
                <span className="block text-gray-600 text-sm truncate">{song.artist}</span>
              </div>
            </div>
            <button 
              onClick={() => onPlay(song)}
              className="p-2 hover:bg-jamoveo-primary hover:text-white text-jamoveo-primary rounded-full transition-colors border border-gray-300 bg-white"
              title="Play"
            >
              <PlayCircle size={24} />
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No songs found. Try searching for something else.</p>
        </div>
      )}
    </div>
  </div>
);

export default SongList; 