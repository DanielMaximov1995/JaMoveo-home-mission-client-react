import { Song } from '../lib/types';
import heyJudeData from '../songs/hey_jude.json';
import veechSheloData from '../songs/veech_shelo.json';

interface SongLine {
  lyrics: string;
  chords?: string;
}

type SongData = SongLine[][];

export const loadSongs = async (): Promise<Song[]> => {
  const songs: Song[] = [];
  
  // Load Hey Jude
  const heyJude: Song = {
    id: 'hey-jude',
    title: 'Hey Jude',
    artist: 'The Beatles',
    lyrics: formatLyrics(heyJudeData as SongData),
    chords: formatChords(heyJudeData as SongData),
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2'
  };
  songs.push(heyJude);

  // Load Veech Shelo
  const veechShelo: Song = {
    id: 'veech-shelo',
    title: 'ויען',
    artist: 'עידן רייכל',
    lyrics: formatLyrics(veechSheloData as SongData),
    chords: formatChords(veechSheloData as SongData),
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2'
  };
  songs.push(veechShelo);

  return songs;
};

const formatLyrics = (songData: SongData): string => {
  return songData
    .map(verse => 
      verse.map(line => line.lyrics).join(' ')
    )
    .join('\n\n');
};

const formatChords = (songData: SongData): string => {
  return songData
    .map(verse => 
      verse
        .filter(line => line.chords)
        .map(line => `${line.lyrics} [${line.chords}]`)
        .join(' ')
    )
    .join('\n\n');
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  const songs = await loadSongs();
  const searchTerm = query.toLowerCase();
  
  return songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm) ||
    song.artist.toLowerCase().includes(searchTerm)
  );
}; 