import { useState, useEffect } from 'react';
import { MdFilterList, MdClose } from 'react-icons/md';
import type { Tag } from '../types/Tag';
import { getTags } from '../services/api';
import { DEFAULT_TAGS } from '../utils/tagUtils';
import Modal from './Modal';
import NoteForm from './NoteForm';
import TagDisplay from './TagDisplay';
import { useNotes } from '../context/NotesContext';

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

function SearchBar({ search, setSearch, selectedTags, setSelectedTags }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const { addNote } = useNotes();

  useEffect(() => {
    // Fetch available tags from API
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags from API, using defaults:', error);
        setAvailableTags(DEFAULT_TAGS);
      }
    };
    fetchTags();
  }, []);

  const toggleTagFilter = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearch('');
  };

  return (
    <>
      {/* Main Search Bar */}
      <div className="flex items-center border-2 border-black rounded h-14 md:h-20">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 h-full px-3 md:px-6 text-xl md:text-3xl text-black border-none focus:outline-none"
          style={{ backgroundColor: '#DDDCC8' }}
        />
        <button 
          className="h-full border-l-2 border-black text-black flex items-center justify-center px-3 md:px-6 hover:bg-gray-200 transition-colors" 
          style={{ backgroundColor: '#DDDCC8', border: 'none', outline: 'none'}} 
          onClick={() => setShowFilters(!showFilters)}
          title="Filter by tags"
        >
          <MdFilterList size={24} className="md:w-8 md:h-8" />
        </button>
        <button 
          className="h-full border-l-2 border-black text-black flex items-center justify-center px-3 md:px-6" 
          style={{ backgroundColor: '#DDDCC8', border: 'none', outline: 'none' }} 
          onClick={() => setOpen(true)}
          title="Create new note"
        >
          <span className="text-2xl md:text-4xl">+</span>
        </button>
      </div>

      {/* Tag Filters */}
      {showFilters && (
        <div className="mt-2 p-2 md:p-4 border-2 border-black rounded" style={{ backgroundColor: '#DDDCC8' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h3 className="font-bold text-base md:text-lg">Filter by Tags</h3>
            {(selectedTags.length > 0 || search.trim() !== '') && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <MdClose size={16} />
                Clear All
              </button>
            )}
          </div>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <div key={tag.id} className="flex items-center">
                    <TagDisplay tag={tag} size="sm" noBorder />
                    <button
                      onClick={() => toggleTagFilter(tag)}
                      className="ml-1 text-red-500 hover:text-red-700"
                      title="Remove filter"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Tags */}
          <div>
            <p className="text-sm font-medium mb-2">Select Tags to Filter:</p>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                .map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTagFilter(tag)}
                    className="hover:opacity-80 transition-opacity"
                    style={{ border: 'none', outline: 'none' }}
                  >
                    <TagDisplay tag={tag} size="sm" noBorder />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Note Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Create Note</h2>
        <NoteForm
          onSubmit={async (title: string, content: string, tags: Tag[]) => {
            await addNote(title, content, tags);
            setOpen(false);
          }}
          submitLabel="Create"
        />
      </Modal>
    </>
  );
}

export default SearchBar;
