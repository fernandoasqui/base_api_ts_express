import { deleteUser, findAllUser, updateUser } from '@/Controllers/UserController';
import { Router } from 'express';

const router = Router();

router.get('/users', findAllUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;
