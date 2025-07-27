import { login, registerUser } from '@/Controllers/AuthController';
import { Router } from 'express';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/register', registerUser);

export default router;
