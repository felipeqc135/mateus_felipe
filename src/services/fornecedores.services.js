import { produtos } from './produtos.services.js';

export let fornecedores = [
  { id: 1, nome: 'Distribuidora Silva', cnpj: '12.345.678/0001-90', telefone: '11999998888', email: 'contato@silva.com' },
  { id: 2, nome: 'Atacadista Central', cnpj: '98.765.432/0001-10', telefone: '11888887777', email: 'vendas@central.com' }
];

export const listarFornecedores = (busca) => {
  if (busca) {
    return fornecedores.filter(f => f.nome.toLowerCase().includes(busca.toLowerCase()));
  }
  return fornecedores;
};

export const buscarFornecedorPorId = (id) => fornecedores.find(f => f.id === id);

export const criarFornecedor = ({ nome, cnpj, telefone, email }) => {
  const existeCNPJ = fornecedores.some(f => f.cnpj === cnpj);
  if (existeCNPJ) {
    throw new Error('Já existe um fornecedor cadastrado com este CNPJ.');
  }

  const novo = {
    id: fornecedores.length + 1,
    nome,
    cnpj,
    telefone: telefone || '',
    email: email || ''
  };

  fornecedores.push(novo);
  return novo;
};

export const atualizarFornecedor = (id, dados) => {
  const fornecedor = buscarFornecedorPorId(id);
  if (!fornecedor) return null;

  const { nome, cnpj, telefone, email } = dados;
  if (nome) fornecedor.nome = nome;
  if (cnpj) fornecedor.cnpj = cnpj;
  if (telefone !== undefined) fornecedor.telefone = telefone;
  if (email !== undefined) fornecedor.email = email;

  return fornecedor;
};

export const excluirFornecedor = (id) => {
  const possuiProdutos = produtos.some(p => p.fornecedorId === id);
  if (possuiProdutos) {
    throw new Error('Não é possível excluir fornecedor associado a produtos vinculados.');
  }

  const indice = fornecedores.findIndex(f => f.id === id);
  if (indice === -1) return false;

  fornecedores.splice(indice, 1);
  return true;
};