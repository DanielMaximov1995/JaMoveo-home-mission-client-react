export type User = {
  id: number;
  username: string;
  instrument: string;
  role: 'player' | 'admin';
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  imageUrl?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
};

export type Session = {
  id: string;
  adminId: number;
  activeSong?: Song;
  participants: User[];
  isActive: boolean;
};