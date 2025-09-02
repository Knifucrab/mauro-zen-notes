import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';

const noteService = new NoteService();

export class NoteController {
  static async getAll(req: Request, res: Response) {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  }

  static async getOne(req: Request, res: Response) {
    const note = await noteService.getNoteById(Number(req.params.id));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }

  static async create(req: Request, res: Response) {
    const { title, description, tagIds } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    try {
      const note = await noteService.createNote(title, description, tagIds);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    const { title, description } = req.body;
    const note = await noteService.updateNote(Number(req.params.id), title, description);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }

  static async delete(req: Request, res: Response) {
    const success = await noteService.deleteNote(Number(req.params.id));
    if (!success) return res.status(404).json({ error: 'Note not found' });
    res.status(204).send();
  }

  static async archive(req: Request, res: Response) {
    const note = await noteService.archiveNote(Number(req.params.id));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }

  static async unarchive(req: Request, res: Response) {
    const note = await noteService.unarchiveNote(Number(req.params.id));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }

  static async addTag(req: Request, res: Response) {
    const { tagId } = req.body;
    if (!tagId) return res.status(400).json({ error: 'tagId is required' });
    const note = await noteService.addTagToNote(Number(req.params.id), tagId);
    if (!note) return res.status(404).json({ error: 'Note or tag not found' });
    res.json(note);
  }

  static async removeTag(req: Request, res: Response) {
    const note = await noteService.removeTagFromNote(Number(req.params.id), Number(req.params.tagId));
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  }
}
