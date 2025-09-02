import { getDataSource } from '../data-source';
import { Note } from '../entity/Note';
import { Tag } from '../entity/Tag';

export class NoteRepository {
  private async getRepo() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Note);
  }

  async findAll() {
    const repo = await this.getRepo();
    return repo.find({ relations: ['tags'] });
  }

  async findById(id: number) {
    const repo = await this.getRepo();
    return repo.findOne({ where: { id }, relations: ['tags'] });
  }

  async create(note: Partial<Note>) {
    const repo = await this.getRepo();
    const newNote = repo.create(note);
    return repo.save(newNote);
  }

  async update(id: number, data: Partial<Note>) {
  const note = await this.findById(id);
  if (!note) return null;
  Object.assign(note, data);
  const repo = await this.getRepo();
  return repo.save(note);
  }

  async delete(id: number) {
    const note = await this.findById(id);
    if (!note) return null;
    const repo = await this.getRepo();
    await repo.remove(note);
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
  const repo = await this.getRepo();
  return repo.save(note);
  }

  async removeTagFromNote(noteId: number, tagId: number) {
  const note = await this.findById(noteId);
  if (!note) return null;
  note.tags = note.tags.filter(tag => tag.id !== tagId);
  const repo = await this.getRepo();
  return repo.save(note);
  }
}
