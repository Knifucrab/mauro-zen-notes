import { AppDataSource } from '../data-source';
import { Note } from '../entity/Note';
import { Tag } from '../entity/Tag';

export class NoteRepository {
  private repo = AppDataSource.getRepository(Note);

  async findAll() {
    return this.repo.find({ relations: ['tags'] });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['tags'] });
  }

  async create(note: Partial<Note>) {
    const newNote = this.repo.create(note);
    return this.repo.save(newNote);
  }

  async update(id: number, data: Partial<Note>) {
    const note = await this.findById(id);
    if (!note) return null;
    Object.assign(note, data);
    return this.repo.save(note);
  }

  async delete(id: number) {
    const note = await this.findById(id);
    if (!note) return null;
    await this.repo.remove(note);
    return true;
  }

  async archive(id: number) {
    return this.update(id, { archived: true });
  }

  async unarchive(id: number) {
    return this.update(id, { archived: false });
  }

  async addTagsToNote(noteId: number, tags: Tag[]) {
    const note = await this.findById(noteId);
    if (!note) return null;
    note.tags = [...(note.tags || []), ...tags];
    return this.repo.save(note);
  }

  async removeTagFromNote(noteId: number, tagId: number) {
    const note = await this.findById(noteId);
    if (!note) return null;
    note.tags = note.tags.filter(tag => tag.id !== tagId);
    return this.repo.save(note);
  }
}
