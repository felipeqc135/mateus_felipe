import * as categoriaService from '../services/categorias.services.js';

export const listar = (req, res) => {
  res.json(categoriaService.listarCategorias());
};

export const criar = (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
  }

  const nova = categoriaService.criarCategoria(nome);
  res.status(201).json(nova);
};