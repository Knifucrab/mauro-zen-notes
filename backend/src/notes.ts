import { Router } from 'express';
import { NoteController } from './controllers/NoteController';

const router = Router();

router.get('/', NoteController.getAll);
router.get('/:id', NoteController.getOne);
router.post('/', NoteController.create);
router.put('/:id', NoteController.update);
router.delete('/:id', NoteController.delete);
router.post('/:id/archive', NoteController.archive);
router.post('/:id/unarchive', NoteController.unarchive);
router.post('/:id/tags', NoteController.addTag);
router.delete('/:id/tags/:tagId', NoteController.removeTag);

export default router;
