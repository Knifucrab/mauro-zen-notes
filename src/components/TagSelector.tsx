import { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import type { Tag } from '../types/Tag';
import { createTag, getTags } from '../services/api';
import TagDisplay from './TagDisplay';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
}

function TagSelector({ selectedTags, onTagsChange, maxTags = 4 }: TagSelectorProps) {
  const [showTagList, setShowTagList] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#FFE4E1');
  const [availableTagsFromAPI, setAvailableTagsFromAPI] = useState<Tag[]>([]);

  useEffect(() => {
    // Fetch available tags from API
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        console.log('Fetched tags from API:', tags);
        // Ensure tags is always an array
        const tagsArray = Array.isArray(tags) ? tags : [];
        setAvailableTagsFromAPI(tagsArray);
      } catch (error) {
        console.error('Failed to fetch tags from API:', error);
        setAvailableTagsFromAPI([]); // Use empty array instead of DEFAULT_TAGS
      }
    };
    fetchTags();
  }, []);

  // Only use API tags, don't fall back to DEFAULT_TAGS since they have wrong IDs
  const allAvailableTags = availableTagsFromAPI;
  
  const availableTags = allAvailableTags.filter(
    tag => !selectedTags.some(selected => selected.id === tag.id)
  );

  const addTag = (tag: Tag) => {
    if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
    setShowTagList(false);
  };

  const removeTag = (tagId: number) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const createNewTag = async () => {
    if (newTagName.trim() && newTagName.length <= 20) {
      try {
        // Try to create the tag via API
        const newTag = await createTag(newTagName.trim(), newTagColor);
        setAvailableTagsFromAPI(prev => [...prev, newTag]);
        addTag(newTag);
        setNewTagName('');
        setNewTagColor('#FFE4E1');
      } catch (error) {
        console.error('Failed to create tag via API, using local fallback:', error);
        // Fallback to local creation
        const newTag: Tag = {
          id: Date.now(), // Simple ID generation for now
          name: newTagName.trim(),
          color: newTagColor
        };
        setAvailableTagsFromAPI(prev => [...prev, newTag]);
        addTag(newTag);
        setNewTagName('');
        setNewTagColor('#FFE4E1');
      }
    }
  };

  return (
    <div className="mb-3 md:mb-4">
      <label className="block text-sm md:text-base font-bold mb-2">Tags (max {maxTags})</label>
      
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
        {selectedTags.map(tag => (
          <div key={tag.id} className="flex items-center">
            <TagDisplay tag={tag} size="md" noBorder />
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="ml-1 text-red-500 hover:text-red-700"
              title="Remove tag"
            >
              <MdClose size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Tag Button */}
      {selectedTags.length < maxTags && (
        <div>
          <button
            type="button"
            onClick={() => setShowTagList(!showTagList)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 border border-black rounded hover:bg-gray-100 transition-colors text-sm md:text-base"
            style={{ backgroundColor: '#DDDCC8' }}
          >
            <MdAdd size={14} className="md:w-4 md:h-4" />
            Add Tag
          </button>

          {/* Tag Selection Dropdown */}
          {showTagList && (
            <div className="mt-2 p-2 md:p-3 border border-black rounded" style={{ backgroundColor: '#DDDCC8' }}>
              {/* Available Tags */}
              {availableTags.length > 0 && (
                <div className="mb-2 md:mb-3">
                  <p className="text-xs md:text-sm font-medium mb-2">Select existing tag:</p>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="hover:opacity-80 transition-opacity bg-transparent p-0"
                        style={{ border: 'none', outline: 'none' }}
                      >
                        <TagDisplay tag={tag} size="md" noBorder />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create New Tag */}
              <div>
                <p className="text-xs md:text-sm font-medium mb-2">Create new tag:</p>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tag name (max 20 chars)"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      maxLength={20}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none text-sm md:text-base"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={createNewTag}
                      disabled={!newTagName.trim()}
                      className="px-2 md:px-3 py-1 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors text-sm md:text-base"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TagSelector;
