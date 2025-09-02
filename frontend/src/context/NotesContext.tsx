import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  addTagToNote,
  removeTagFromNote,
} from '../services/api';
import type { Tag } from '../types/Tag';

export type Note = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  archived: boolean;
  expanded?: boolean;
  tags?: Tag[];
};

type NotesContextType = {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string, tags?: Tag[]) => Promise<void>;
  editNote: (id: number, title: string, content: string, tags?: Tag[]) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
  archive: (id: number) => Promise<void>;
  unarchive: (id: number) => Promise<void>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const fetchNotes = async () => {
    try {
      console.log('Fetching notes from API...');
      const data = await getNotes();
      console.log('API Response:', data);
      // Add expanded property for UI and ensure tags exist
      setNotes(data.map((note: Note) => ({ 
        ...note, 
        expanded: false,
        tags: note.tags || []
      })));
    } catch (error) {
      console.error('Failed to fetch notes from API, keeping localStorage data:', error);
      // Keep existing localStorage data if API fails - don't reset the notes
    }
  };

  const addNote = async (title: string, description: string, tags: Tag[] = []) => {
    try {
      console.log('Creating note with tags:', { title, description, tags });
      await createNote(title, description, tags);
      await fetchNotes();
    } catch (error) {
      console.error('Failed to create note via API, adding to localStorage:', error);
      // Fallback to localStorage
      const newNote: Note = {
        id: Date.now(),
        title,
        description,
        creationDate: new Date().toISOString(),
        archived: false,
        expanded: false,
        tags
      };
      setNotes(prev => [...prev, newNote]);
    }
  };

  const editNote = async (id: number, title: string, description: string, tags: Tag[] = []) => {
    try {
      // First update the note content
      await updateNote(id, title, description);
      
      // Get the current note to compare tags
      const currentNote = notes.find(note => note.id === id);
      if (currentNote) {
        const currentTagIds = (currentNote.tags || []).map(tag => tag.id);
        const newTagIds = tags.map(tag => tag.id);
        
        // Find tags to remove
        const tagsToRemove = currentTagIds.filter(tagId => !newTagIds.includes(tagId));
        
        // Find tags to add
        const tagsToAdd = newTagIds.filter(tagId => !currentTagIds.includes(tagId));
        
        // Remove tags
        for (const tagId of tagsToRemove) {
          try {
            await removeTagFromNote(id, tagId);
          } catch (error) {
            console.error(`Failed to remove tag ${tagId} from note ${id}:`, error);
          }
        }
        
        // Add new tags
        for (const tagId of tagsToAdd) {
          try {
            await addTagToNote(id, tagId);
          } catch (error) {
            console.error(`Failed to add tag ${tagId} to note ${id}:`, error);
          }
        }
      }
      
      await fetchNotes();
    } catch (error) {
      console.error('Failed to update note via API, updating localStorage:', error);
      // Fallback to localStorage
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, title, description, tags }
          : note
      ));
    }
  };

  const removeNote = async (id: number) => {
    await deleteNote(id);
    await fetchNotes();
  };

  const archive = async (id: number) => {
    await archiveNote(id);
    await fetchNotes();
  };

  const unarchive = async (id: number) => {
    await unarchiveNote(id);
    await fetchNotes();
  };

  return (
    <NotesContext.Provider value={{ notes, fetchNotes, addNote, editNote, removeNote, archive, unarchive, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
