import { Router } from 'express';
import * as controller from '../controllers/produtos.controllers.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', controller.listar);
router.get('/alerta-estoque', controller.alertaEstoque);
router.get('/:id', controller.buscarPorId);
router.post('/', auth, controller.criar);
router.put('/:id', auth, controller.atualizar);
router.post('/:id/entrada', auth, controller.entradaEstoque);
router.delete('/:id', auth, controller.excluir);

export default router;