"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const NoteService_1 = require("../dist/services/NoteService");
const noteService = new NoteService_1.NoteService();
class NoteController {
    static async getAll(req, res) {
        const notes = await noteService.getAllNotes();
        res.json(notes);
    }
    static async getOne(req, res) {
        const note = await noteService.getNoteById(Number(req.params.id));
        if (!note)
            return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    static async create(req, res) {
        const { title, description, tagIds } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
        try {
            const note = await noteService.createNote(title, description, tagIds);
            res.status(201).json(note);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async update(req, res) {
        const { title, description } = req.body;
        const note = await noteService.updateNote(Number(req.params.id), title, description);
        if (!note)
            return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    static async delete(req, res) {
        const success = await noteService.deleteNote(Number(req.params.id));
        if (!success)
            return res.status(404).json({ error: 'Note not found' });
        res.status(204).send();
    }
    static async archive(req, res) {
        const note = await noteService.archiveNote(Number(req.params.id));
        if (!note)
            return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    static async unarchive(req, res) {
        const note = await noteService.unarchiveNote(Number(req.params.id));
        if (!note)
            return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
    static async addTag(req, res) {
        const { tagId } = req.body;
        if (!tagId)
            return res.status(400).json({ error: 'tagId is required' });
        const note = await noteService.addTagToNote(Number(req.params.id), tagId);
        if (!note)
            return res.status(404).json({ error: 'Note or tag not found' });
        res.json(note);
    }
    static async removeTag(req, res) {
        const note = await noteService.removeTagFromNote(Number(req.params.id), Number(req.params.tagId));
        if (!note)
            return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    }
}
exports.NoteController = NoteController;
