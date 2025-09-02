import { useState } from 'react';
import type { Tag } from '../types/Tag';
import TagSelector from './TagSelector';

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: Tag[];
  onSubmit: (title: string, content: string, tags: Tag[]) => void;
  submitLabel: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  initialTitle = '', 
  initialContent = '', 
  initialTags = [],
  onSubmit, 
  submitLabel 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(title, content, selectedTags);
      }}
      className="flex flex-col gap-3 md:gap-4"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border border-black px-3 md:px-4 py-2 text-black text-sm md:text-base"
        style={{ backgroundColor: '#DDDCC8' }}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="border border-black px-3 md:px-4 py-2 text-black text-sm md:text-base resize-none"
        style={{ backgroundColor: '#DDDCC8' }}
        rows={4}
        required
      />
      <TagSelector 
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        maxTags={4}
      />
      <button type="submit" className="px-3 md:px-4 py-2 border border-black font-bold text-sm md:text-base" style={{backgroundColor:'#DDDCC8',color:'black'}}>
        {submitLabel}
      </button>
    </form>
  );
};

export default NoteForm;
