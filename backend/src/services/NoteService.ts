import { NoteRepository } from '../repositories/NoteRepository';
import { TagRepository } from '../repositories/TagRepository';

export class NoteService {
  private noteRepo = new NoteRepository();
  private tagRepo = new TagRepository();

  async getAllNotes() {
    return this.noteRepo.findAll();
  }

  async getNoteById(id: number) {
    return this.noteRepo.findById(id);
  }

  async createNote(title: string, description: string, tagIds?: number[]) {
    // Validate max 4 tags per note
    if (tagIds && tagIds.length > 4) {
      throw new Error('Maximum 4 tags allowed per note');
    }

    const note = await this.noteRepo.create({
      title,
      description,
      creationDate: new Date().toISOString(),
      archived: false,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await Promise.all(tagIds.map(id => this.tagRepo.findById(id)));
      const validTags = tags.filter(tag => tag !== null);
      if (validTags.length > 0) {
        await this.noteRepo.addTagsToNote(note.id, validTags);
      }
    }

    return this.noteRepo.findById(note.id);
  }

  async updateNote(id: number, title?: string, description?: string) {
    const data: any = {};
    if (title) data.title = title;
    if (description) data.description = description;
    return this.noteRepo.update(id, data);
  }

  async deleteNote(id: number) {
    return this.noteRepo.delete(id);
  }

  async archiveNote(id: number) {
    return this.noteRepo.archive(id);
  }

  async unarchiveNote(id: number) {
    return this.noteRepo.unarchive(id);
  }

  async addTagToNote(noteId: number, tagId: number) {
    const note = await this.noteRepo.findById(noteId);
    if (!note) return null;
    
    // Check if note already has 4 tags
    if (note.tags && note.tags.length >= 4) {
      throw new Error('Maximum 4 tags allowed per note');
    }
    
    // Check if tag is already added to note
    if (note.tags && note.tags.some(tag => tag.id === tagId)) {
      throw new Error('Tag already added to this note');
    }

    const tag = await this.tagRepo.findById(tagId);
    if (!tag) return null;
    return this.noteRepo.addTagsToNote(noteId, [tag]);
  }

  async removeTagFromNote(noteId: number, tagId: number) {
    return this.noteRepo.removeTagFromNote(noteId, tagId);
  }
}
