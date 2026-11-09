import { Router } from 'express';
import * as controller from '../controllers/vendas.controllers.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', auth, controller.criar);
router.delete('/:id/cancelar', auth, controller.cancelar);

export default router;