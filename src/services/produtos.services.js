import { fornecedores } from './fornecedores.services.js';

export let produtos = [
  { id: 1, nome: 'Café 500g', categoriaId: 2, preco: 18.50, quantidadeEstoque: 20, estoqueMinimo: 5, fornecedorId: 1 },
  { id: 2, nome: 'Refrigerante 2L', categoriaId: 1, preco: 8.00, quantidadeEstoque: 3, estoqueMinimo: 10, fornecedorId: 2 },
  { id: 3, nome: 'Detergente 500ml', categoriaId: 3, preco: 3.20, quantidadeEstoque: 15, estoqueMinimo: 8, fornecedorId: 1 }
];

export const listarProdutos = ({ busca, categoriaId }) => {
  let resultado = produtos;
  if (busca) resultado = resultado.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
  if (categoriaId) resultado = resultado.filter(p => p.categoriaId === parseInt(categoriaId));
  return resultado;
};

export const obterAlertaEstoque = () => {
  const emAlerta = produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo);
  return { totalEmAlerta: emAlerta.length, produtos: emAlerta };
};

export const buscarProdutoPorId = (id) => produtos.find(p => p.id === id);

export const criarProduto = ({ nome, categoriaId, preco, quantidadeEstoque, estoqueMinimo, fornecedorId }) => {
  const fornecedorExiste = fornecedores.some(f => f.id === parseInt(fornecedorId));
  if (!fornecedorExiste) {
    throw new Error('Fornecedor informado não existe.');
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    categoriaId: categoriaId ? parseInt(categoriaId) : null,
    preco: parseFloat(preco),
    quantidadeEstoque: parseInt(quantidadeEstoque),
    estoqueMinimo: estoqueMinimo ? parseInt(estoqueMinimo) : 5,
    fornecedorId: parseInt(fornecedorId)
  };

  produtos.push(novoProduto);
  return novoProduto;
};

export const atualizarProduto = (id, dados) => {
  const produto = buscarProdutoPorId(id);
  if (!produto) return null;

  const { nome, categoriaId, preco, estoqueMinimo, fornecedorId } = dados;
  if (nome) produto.nome = nome;
  if (categoriaId) produto.categoriaId = parseInt(categoriaId);
  if (preco !== undefined) produto.preco = parseFloat(preco);
  if (estoqueMinimo !== undefined) produto.estoqueMinimo = parseInt(estoqueMinimo);
  if (fornecedorId) produto.fornecedorId = parseInt(fornecedorId);

  return produto;
};

export const darEntradaEstoque = (id, quantidade) => {
  const produto = buscarProdutoPorId(id);
  if (!produto) return null;

  produto.quantidadeEstoque += parseInt(quantidade);
  return produto;
};

export const excluirProduto = (id) => {
  const indice = produtos.findIndex(p => p.id === id);
  if (indice === -1) return false;

  produtos.splice(indice, 1);
  return true;
};