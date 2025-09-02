import { createContext } from 'react';
import type { Note } from './NotesContext';
import type { Tag } from '../types/Tag';

export type NotesContextType = {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string, tags?: Tag[]) => Promise<void>;
  editNote: (id: number, title: string, content: string, tags?: Tag[]) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
  archive: (id: number) => Promise<void>;
  unarchive: (id: number) => Promise<void>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const NotesContext = createContext<NotesContextType | undefined>(undefined);
