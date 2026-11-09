import { Router } from 'express';
import * as controller from '../controllers/fornecedores.controllers.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', auth, controller.criar);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.excluir);

export default router;