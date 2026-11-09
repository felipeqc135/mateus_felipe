import * as produtoService from '../services/produtos.services.js';

export const listar = (req, res) => {
  const { busca, categoriaId } = req.query;
  res.json(produtoService.listarProdutos({ busca, categoriaId }));
};

export const alertaEstoque = (req, res) => {
  res.json(produtoService.obterAlertaEstoque());
};

export const buscarPorId = (req, res) => {
  const produto = produtoService.buscarProdutoPorId(parseInt(req.params.id));
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }
  res.json(produto);
};

export const criar = (req, res) => {
  const { nome, categoriaId, preco, quantidadeEstoque, estoqueMinimo, fornecedorId } = req.body;

  if (!nome || preco === undefined || quantidadeEstoque === undefined || !fornecedorId) {
    return res.status(400).json({ erro: 'Preencha nome, preço, quantidade em estoque e fornecedorId.' });
  }

  try {
    const produto = produtoService.criarProduto({ nome, categoriaId, preco, quantidadeEstoque, estoqueMinimo, fornecedorId });
    res.status(201).json(produto);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

export const atualizar = (req, res) => {
  const produto = produtoService.atualizarProduto(parseInt(req.params.id), req.body);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }
  res.json({ mensagem: 'Produto atualizado com sucesso.', produto });
};

export const entradaEstoque = (req, res) => {
  const { quantidade } = req.body;

  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: 'A quantidade de reposição deve ser maior que zero.' });
  }

  const produto = produtoService.darEntradaEstoque(parseInt(req.params.id), quantidade);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  res.json({
    mensagem: 'Entrada de estoque realizada com sucesso.',
    produtoId: produto.id,
    novoEstoque: produto.quantidadeEstoque
  });
};

export const excluir = (req, res) => {
  const sucesso = produtoService.excluirProduto(parseInt(req.params.id));
  if (!sucesso) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }
  res.json({ mensagem: 'Produto removido do sistema com sucesso.' });
};