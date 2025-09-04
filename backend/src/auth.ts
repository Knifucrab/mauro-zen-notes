import { Router } from 'express';
import { AuthController } from './controllers/AuthController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/setup-default-user', AuthController.createDefaultUser);

export default router;
