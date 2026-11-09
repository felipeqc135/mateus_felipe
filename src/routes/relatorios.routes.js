import { Router } from 'express';
import * as controller from '../controllers/relatorios.controllers.js';

const router = Router();

router.get('/vendas', controller.vendas);
router.get('/estoque-baixo', controller.estoqueBaixo);

export default router;