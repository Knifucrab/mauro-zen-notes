import { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdArchive, MdUnarchive, MdExpandMore, MdExpandLess } from 'react-icons/md';
import type { Note } from '../context/NotesContext';
import type { Tag } from '../types/Tag';
import Modal from './Modal';
import NoteForm from './NoteForm';
import TagDisplay from './TagDisplay';
import { useNotes } from '../context/NotesContext';

interface NotesListProps {
  notes: Note[];
  search: string;
  selectedTags: Tag[];
  toggleExpand: (id: number) => void;
}

function NotesList({ notes, search, selectedTags, toggleExpand }: NotesListProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showingArchived, setShowingArchived] = useState(false);
  const { editNote, removeNote, archive, unarchive, notes: contextNotes } = useNotes();

  const editingNote = contextNotes.find(n => n.id === editId);
  
  // Filter notes based on whether we're showing archived or active notes
  const activeNotes = notes.filter(note => !note.archived);
  const archivedNotes = notes.filter(note => note.archived);
  const displayNotes = showingArchived ? archivedNotes : activeNotes;
  
  // Auto-switch to active notes when unarchiving the last archived note
  useEffect(() => {
    if (showingArchived && archivedNotes.length === 0) {
      setShowingArchived(false);
    }
  }, [archivedNotes.length, showingArchived]);
  
  // Apply search and tag filters
  const filteredNotes = displayNotes.filter(note => {
    // Text search filter
    const query = search.trim().toLowerCase();
    let matchesText = true;
    if (query) {
      const titleWords = note.title.toLowerCase().split(/\s+/);
      const descWords = note.description.toLowerCase().split(/\s+/);
      const matchWord = (words: string[]) => words.some(word => word.includes(query));
      matchesText = matchWord(titleWords) || matchWord(descWords);
    }

    // Tag filter
    let matchesTags = true;
    if (selectedTags.length > 0) {
      const noteTags = note.tags || [];
      matchesTags = selectedTags.every(selectedTag => 
        noteTags.some(noteTag => noteTag.id === selectedTag.id)
      );
    }

    return matchesText && matchesTags;
  });

  return (
    <div className="flex flex-col h-auto pt-8">
      {/* Archived Notes Toggle - only show if there are archived notes */}
      {archivedNotes.length > 0 && (
        <div 
          className="mb-4 p-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors flex justify-between items-center"
          onClick={() => setShowingArchived(!showingArchived)}
        >
          <span>{showingArchived ? 'Exit archived notes' : 'Archived Notes'}</span>
          {!showingArchived && <span>{archivedNotes.length}</span>}
        </div>
      )}
      
      {filteredNotes.length === 0 && notes.length === 0 ? (
        <div className="text-center text-black opacity-60">No notes yet.</div>
      ) : filteredNotes.length === 0 && !showingArchived && activeNotes.length === 0 ? (
        // Don't show "No active notes" message when there are only archived notes
        null
      ) : filteredNotes.length === 0 && (search.trim() !== '' || selectedTags.length > 0) ? (
        <div className="text-center text-black opacity-60">
          {showingArchived 
            ? 'No archived notes match your filters.' 
            : 'No active notes match your filters.'}
        </div>
      ) : (
        filteredNotes
          .map(note => (
            <div
              key={note.id}
              className={`border-t-2 border-black transition-all duration-200 flex flex-col ${note.archived ? 'opacity-60' : ''}`}
              style={{ borderRadius: 0, backgroundColor: '#DDDCC8' }}
            >
              <div className="flex items-center px-2 md:px-4 text-lg md:text-2xl justify-between w-full py-3 md:py-4">
                <div className="flex items-center cursor-pointer flex-1 min-w-0" onClick={() => toggleExpand(note.id)}>
                  <span className={`font-bold truncate ${note.archived ? 'text-gray-800' : 'text-black'}`}>{note.title}</span>
                  <span className={`ml-2 flex-shrink-0 ${note.archived ? 'text-gray-800' : 'text-black'}`}>
                    {note.expanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                  </span>
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap flex-shrink-0">
                    {note.tags.slice(0, 3).map(tag => (
                      <TagDisplay key={tag.id} tag={tag} size="sm" />
                    ))}
                  </div>
                )}
              </div>
              {note.expanded && (
                <div className="px-2 md:px-4 pb-3 md:pb-4">
                  <div className={`mb-3 md:mb-4 text-sm md:text-base ${note.archived ? 'text-gray-800' : 'text-black'}`}>
                    {note.description}
                  </div>
                  <div className="flex justify-between items-center gap-1 md:gap-2">
                    <span className={`text-xs md:text-sm font-bold ${note.archived ? 'text-gray-800' : 'text-black'}`}>
                      {new Date(note.creationDate).toLocaleDateString('en-US', { 
                        month: '2-digit', 
                        day: '2-digit', 
                        year: 'numeric' 
                      })}
                    </span>
                    <div className="flex gap-1 md:gap-2">
                      <button 
                        className="p-1.5 md:p-2 border border-black hover:bg-gray-100 transition-colors" 
                        style={{backgroundColor:'#DDDCC8',color:'black'}} 
                        onClick={() => setEditId(note.id)}
                        title="Edit"
                      >
                        <MdEdit size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      <button 
                        className="p-1.5 md:p-2 border border-black hover:bg-gray-100 transition-colors" 
                        style={{backgroundColor:'#DDDCC8',color:'black'}} 
                        onClick={() => setDeleteId(note.id)}
                        title="Delete"
                      >
                        <MdDelete size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      {note.archived ? (
                        <button 
                          className="p-1.5 md:p-2 border border-black hover:bg-gray-100 transition-colors" 
                          style={{backgroundColor:'#DDDCC8',color:'black'}} 
                          onClick={() => unarchive(note.id)}
                          title="Unarchive"
                        >
                          <MdUnarchive size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      ) : (
                        <button 
                          className="p-1.5 md:p-2 border border-black hover:bg-gray-100 transition-colors" 
                          style={{backgroundColor:'#DDDCC8',color:'black'}} 
                          onClick={() => archive(note.id)}
                          title="Archive"
                        >
                          <MdArchive size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
      )}

      {/* Edit Note Modal */}
      <Modal open={!!editId} onClose={() => setEditId(null)}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Edit Note</h2>
        {editingNote && (
          <NoteForm
            initialTitle={editingNote.title}
            initialContent={editingNote.description}
            initialTags={editingNote.tags || []}
            onSubmit={async (title: string, description: string, tags: Tag[]) => {
              await editNote(editingNote.id, title, description, tags);
              setEditId(null);
            }}
            submitLabel="Save"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Delete Note</h2>
        <p className="text-sm md:text-base mb-3 md:mb-4">Are you sure you want to delete this note?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 md:px-4 py-2 border border-black text-sm md:text-base" 
            style={{backgroundColor:'#f5f5f5',color:'black'}} 
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </button>
          <button 
            className="px-3 md:px-4 py-2 border border-black text-sm md:text-base" 
            style={{backgroundColor:'#E8BCA4',color:'black'}} 
            onClick={async () => {
              if (deleteId) {
                await removeNote(deleteId);
                setDeleteId(null);
              }
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default NotesList;
