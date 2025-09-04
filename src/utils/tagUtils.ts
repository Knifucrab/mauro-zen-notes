import type { Tag } from '../types/Tag';

export const DEFAULT_TAGS: Tag[] = [
  { id: 1, name: 'Work', color: '#FFE4E1' }, // Light pink
  { id: 2, name: 'Personal', color: '#E1F5FE' }, // Light blue
  { id: 3, name: 'Ideas', color: '#F1F8E9' }, // Light green
  { id: 4, name: 'Important', color: '#FFF3E0' }, // Light orange
];

// Mock data for testing - can be replaced with API calls later
export const getSampleNotesWithTags = () => [
  {
    id: 1,
    title: 'First Note',
    description: 'This is the content of the first note.',
    creationDate: '2025-09-01',
    archived: false,
    expanded: false,
    tags: [DEFAULT_TAGS[0], DEFAULT_TAGS[3]] // Work, Important
  },
  {
    id: 2,
    title: 'Second Note', 
    description: 'This is the content of the second note.',
    creationDate: '2025-09-01',
    archived: false,
    expanded: false,
    tags: [DEFAULT_TAGS[1], DEFAULT_TAGS[2]] // Personal, Ideas
  }
];
