export type Tag = {
  id: number;
  name: string;
  color: string;
};

export const DEFAULT_TAGS: Tag[] = [
  { id: 1, name: 'Work', color: '#FFE4E1' }, // Light pink
  { id: 2, name: 'Personal', color: '#E1F5FE' }, // Light blue
  { id: 3, name: 'Ideas', color: '#F1F8E9' }, // Light green
  { id: 4, name: 'Important', color: '#FFF3E0' }, // Light orange
];
