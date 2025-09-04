import { Request, Response } from 'express';
import { TagService } from '../services/TagService';

const tagService = new TagService();

export class TagController {
  static async getAll(req: Request, res: Response) {
    const tags = await tagService.getAllTags();
    res.json(tags);
  }

  static async getOne(req: Request, res: Response) {
    const tag = await tagService.getTagById(Number(req.params.id));
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(tag);
  }

  static async create(req: Request, res: Response) {
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }
    try {
      const tag = await tagService.createTag(name, color);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    const { name, color } = req.body;
    const tag = await tagService.updateTag(Number(req.params.id), name, color);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(tag);
  }

  static async delete(req: Request, res: Response) {
    const success = await tagService.deleteTag(Number(req.params.id));
    if (!success) return res.status(404).json({ error: 'Tag not found' });
    res.status(204).send();
  }
}
