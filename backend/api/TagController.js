"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const TagService_1 = require("../dist/services/TagService");
const tagService = new TagService_1.TagService();
class TagController {
    static async getAll(req, res) {
        const tags = await tagService.getAllTags();
        res.json(tags);
    }
    static async getOne(req, res) {
        const tag = await tagService.getTagById(Number(req.params.id));
        if (!tag)
            return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    }
    static async create(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        try {
            const tag = await tagService.createTag(name);
            res.status(201).json(tag);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async update(req, res) {
        const { name } = req.body;
        const tag = await tagService.updateTag(Number(req.params.id), name);
        if (!tag)
            return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    }
    static async delete(req, res) {
        const success = await tagService.deleteTag(Number(req.params.id));
        if (!success)
            return res.status(404).json({ error: 'Tag not found' });
        res.status(204).send();
    }
}
exports.TagController = TagController;
