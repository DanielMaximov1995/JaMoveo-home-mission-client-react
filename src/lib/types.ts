export type User = {
  id: string;
  username: string;
  instrument: string;
  role?: 'player' | 'admin';
  isAdmin?: boolean;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  imageUrl?: string;
  key?: string;
  tempo?: string;
  timeSignature?: string;
  difficulty?: string;
  genre?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type SearchResult = Song;

export type Session = {
  id: string;
  adminId: number;
  activeSong?: Song;
  participants: User[];
  isActive: boolean;
};