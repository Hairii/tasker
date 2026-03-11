import express from 'express';
import { login , register , deleteUser , update} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/token.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.delete('/delete', verifyToken, deleteUser)
router.patch('/update' , verifyToken, update)
export default router;
