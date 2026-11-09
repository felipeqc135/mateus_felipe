import { produtos, buscarProdutoPorId } from './produtos.services.js';

export let vendas = [
  {
    id: 1,
    data: new Date().toISOString(),
    valorTotal: 37.00,
    status: 'CONCLUIDA',
    itens: [
      { produtoId: 1, nome: 'Café 500g', quantidade: 2, precoUnitario: 18.50, subtotal: 37.00 }
    ]
  }
];

export const listarVendas = () => vendas;

export const buscarVendaPorId = (id) => vendas.find(v => v.id === id);

export const criarVenda = (itens) => {
  for (const item of itens) {
    const prod = buscarProdutoPorId(parseInt(item.produtoId));
    if (!prod) {
      throw new Error(`Produto de ID ${item.produtoId} não encontrado.`);
    }
    if (prod.quantidadeEstoque < item.quantidade) {
      throw new Error(`Estoque insuficiente para o produto: ${prod.nome}. Disponível: ${prod.quantidadeEstoque}`);
    }
  }

  let valorTotal = 0;

  const itensVenda = itens.map(item => {
    const prod = buscarProdutoPorId(parseInt(item.produtoId));
    prod.quantidadeEstoque -= parseInt(item.quantidade);

    const subtotal = prod.preco * parseInt(item.quantidade);
    valorTotal += subtotal;

    return {
      produtoId: prod.id,
      nome: prod.nome,
      quantidade: parseInt(item.quantidade),
      precoUnitario: prod.preco,
      subtotal
    };
  });

  const novaVenda = {
    id: vendas.length + 1,
    data: new Date().toISOString(),
    valorTotal,
    status: 'CONCLUIDA',
    itens: itensVenda
  };

  vendas.push(novaVenda);
  return novaVenda;
};

export const cancelarVenda = (vendaId) => {
  const venda = buscarVendaPorId(vendaId);
  if (!venda) return { erro: 'Venda não encontrada.', status: 404 };
  if (venda.status === 'CANCELADA') return { erro: 'Esta venda já se encontra cancelada.', status: 400 };

  const dataVenda = new Date(venda.data).toDateString();
  const hoje = new Date().toDateString();

  if (dataVenda !== hoje) {
    return { erro: 'RN02: O cancelamento só é permitido no mesmo dia em que a venda foi realizada.', status: 400 };
  }

  venda.itens.forEach(item => {
    const prod = buscarProdutoPorId(item.produtoId);
    if (prod) {
      prod.quantidadeEstoque += item.quantidade;
    }
  });

  venda.status = 'CANCELADA';
  return { venda };
};

export const relatorioVendas = () => {
  const vendasConcluidas = vendas.filter(v => v.status === 'CONCLUIDA');
  const totalFaturado = vendasConcluidas.reduce((acc, v) => acc + v.valorTotal, 0);

  return {
    totalVendasRealizadas: vendasConcluidas.length,
    faturamentoTotal: totalFaturado,
    vendas: vendasConcluidas
  };
};

export const relatorioEstoqueBaixo = () => {
  const relatorio = produtos
    .filter(p => p.quantidadeEstoque <= p.estoqueMinimo)
    .map(p => ({
      id: p.id,
      nome: p.nome,
      quantidadeEstoque: p.quantidadeEstoque,
      estoqueMinimo: p.estoqueMinimo,
      status: p.quantidadeEstoque === 0 ? 'CRÍTICO (SEM ESTOQUE)' : 'BAIXO'
    }));

  return {
    totalItensNecessitamReposicao: relatorio.length,
    itens: relatorio
  };
};