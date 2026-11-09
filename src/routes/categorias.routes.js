import { Router } from 'express';
import * as controller from '../controllers/categorias.controllers.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', controller.listar);
router.post('/', auth, controller.criar);

export default router;