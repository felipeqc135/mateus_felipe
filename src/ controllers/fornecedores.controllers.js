import * as fornecedorService from '../services/fornecedores.services.js';

export const listar = (req, res) => {
  const { busca } = req.query;
  res.json(fornecedorService.listarFornecedores(busca));
};

export const buscarPorId = (req, res) => {
  const fornecedor = fornecedorService.buscarFornecedorPorId(parseInt(req.params.id));
  if (!fornecedor) {
    return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  }
  res.json(fornecedor);
};

export const criar = (req, res) => {
  const { nome, cnpj, telefone, email } = req.body;

  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são campos obrigatórios.' });
  }

  try {
    const novo = fornecedorService.criarFornecedor({ nome, cnpj, telefone, email });
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const atualizar = (req, res) => {
  const fornecedor = fornecedorService.atualizarFornecedor(parseInt(req.params.id), req.body);
  if (!fornecedor) {
    return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  }
  res.json({ mensagem: 'Fornecedor atualizado com sucesso.', fornecedor });
};

export const excluir = (req, res) => {
  try {
    const sucesso = fornecedorService.excluirFornecedor(parseInt(req.params.id));
    if (!sucesso) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    }
    res.json({ mensagem: 'Fornecedor excluído com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};