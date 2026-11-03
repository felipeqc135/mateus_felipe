const express = require('express');
const app = express();

app.use(express.json());

let fornecedores = [
  { id: 1, nome: 'Distribuidora Silva', cnpj: '12.345.678/0001-90', telefone: '11999998888', email: 'contato@silva.com' },
  { id: 2, nome: 'Atacadista Central', cnpj: '98.765.432/0001-10', telefone: '11888887777', email: 'vendas@central.com' }
];

let categorias = [
  { id: 1, nome: 'Bebidas' },
  { id: 2, nome: 'Alimentos' },
  { id: 3, nome: 'Limpeza' }
];

let produtos = [
  { id: 1, nome: 'Café 500g', categoriaId: 2, preco: 18.50, quantidadeEstoque: 20, estoqueMinimo: 5, fornecedorId: 1 },
  { id: 2, nome: 'Refrigerante 2L', categoriaId: 1, preco: 8.00, quantidadeEstoque: 3, estoqueMinimo: 10, fornecedorId: 2 },
  { id: 3, nome: 'Detergente 500ml', categoriaId: 3, preco: 3.20, quantidadeEstoque: 15, estoqueMinimo: 8, fornecedorId: 1 }
];

let vendas = [
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

const auth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token !== 'Bearer token-secreto-123') {
    return res.status(401).json({ erro: 'Acesso negado. Token de autenticação inválido ou ausente.' });
  }

  next();
};

const logger = (req, res, next) => {
  const dataAtual = new Date().toISOString();
  console.log(`[${dataAtual}] ${req.method} em ${req.url}`);
  next();
};

app.use(logger);

app.get('/', (req, res) => {
  res.json({
    sistema: 'API de Controle de Estoque e Vendas',
    versao: '1.0.0',
    status: 'Online'
  });
});

app.get('/categorias', (req, res) => {
  res.json(categorias);
});

app.post('/categorias', auth, (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
  }

  const nova = { id: categorias.length + 1, nome };
  categorias.push(nova);
  res.status(201).json(nova);
});

app.get('/fornecedores', (req, res) => {
  const { busca } = req.query;

  if (busca) {
    const filtrados = fornecedores.filter(f => f.nome.toLowerCase().includes(busca.toLowerCase()));
    return res.json(filtrados);
  } else {
    res.json(fornecedores);
  }
});

app.get('/fornecedores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const fornecedor = fornecedores.find(f => f.id === id);

  if (!fornecedor) {
    return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  }

  res.json(fornecedor);
});

app.post('/fornecedores', auth, (req, res) => {
  const { nome, cnpj, telefone, email } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Nome e CNPJ são campos obrigatórios.' });
  } else {
    if (!cnpj) {
      return res.status(400).json({ erro: 'Nome e CNPJ são campos obrigatórios.' });
    }
  }

  const existeCNPJ = fornecedores.some(f => f.cnpj === cnpj);

  if (existeCNPJ) {
    return res.status(400).json({ erro: 'Já existe um fornecedor cadastrado com este CNPJ.' });
  }

  let telefoneFinal;
  let emailFinal;

  if (telefone) {
    telefoneFinal = telefone;
  } else {
    telefoneFinal = '';
  }

  if (email) {
    emailFinal = email;
  } else {
    emailFinal = '';
  }

  const novo = {
    id: fornecedores.length + 1,
    nome,
    cnpj,
    telefone: telefoneFinal,
    email: emailFinal
  };

  fornecedores.push(novo);
  res.status(201).json(novo);
});

app.put('/fornecedores/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const fornecedor = fornecedores.find(f => f.id === id);

  if (!fornecedor) {
    return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  }

  const { nome, cnpj, telefone, email } = req.body;

  if (nome) fornecedor.nome = nome;
  if (cnpj) fornecedor.cnpj = cnpj;
  if (telefone !== undefined) fornecedor.telefone = telefone;
  if (email !== undefined) fornecedor.email = email;

  res.json({ mensagem: 'Fornecedor atualizado com sucesso.', fornecedor });
});

app.delete('/fornecedores/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const possuiProdutos = produtos.some(p => p.fornecedorId === id);

  if (possuiProdutos) {
    return res.status(400).json({ erro: 'Não é possível excluir fornecedor associado a produtos vinculados.' });
  }

  const indice = fornecedores.findIndex(f => f.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  }

  fornecedores.splice(indice, 1);
  res.json({ mensagem: 'Fornecedor excluído com sucesso.' });
});

app.get('/produtos', (req, res) => {
  const { busca, categoriaId } = req.query;
  let resultado = produtos;

  if (busca) {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
  }

  if (categoriaId) {
    resultado = resultado.filter(p => p.categoriaId === parseInt(categoriaId));
  }

  res.json(resultado);
});

app.get('/produtos/alerta-estoque', (req, res) => {
  const emAlerta = produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo);

  res.json({
    totalEmAlerta: emAlerta.length,
    produtos: emAlerta
  });
});

app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  res.json(produto);
});

app.post('/produtos', auth, (req, res) => {
  const { nome, categoriaId, preco, quantidadeEstoque, estoqueMinimo, fornecedorId } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Preencha nome, preço, quantidade em estoque e fornecedorId.' });
  } else {
    if (preco === undefined) {
      return res.status(400).json({ erro: 'Preencha nome, preço, quantidade em estoque e fornecedorId.' });
    } else {
      if (quantidadeEstoque === undefined) {
        return res.status(400).json({ erro: 'Preencha nome, preço, quantidade em estoque e fornecedorId.' });
      } else {
        if (!fornecedorId) {
          return res.status(400).json({ erro: 'Preencha nome, preço, quantidade em estoque e fornecedorId.' });
        }
      }
    }
  }

  const fornecedorExiste = fornecedores.some(f => f.id === parseInt(fornecedorId));

  if (!fornecedorExiste) {
    return res.status(404).json({ erro: 'Fornecedor informado não existe.' });
  }

  let categoriaFinal;
  let estoqueMinimoFinal;

  if (categoriaId) {
    categoriaFinal = parseInt(categoriaId);
  } else {
    categoriaFinal = null;
  }

  if (estoqueMinimo) {
    estoqueMinimoFinal = parseInt(estoqueMinimo);
  } else {
    estoqueMinimoFinal = 5;
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    categoriaId: categoriaFinal,
    preco: parseFloat(preco),
    quantidadeEstoque: parseInt(quantidadeEstoque),
    estoqueMinimo: estoqueMinimoFinal,
    fornecedorId: parseInt(fornecedorId)
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

app.put('/produtos/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  const { nome, categoriaId, preco, estoqueMinimo, fornecedorId } = req.body;

  if (nome) produto.nome = nome;
  if (categoriaId) produto.categoriaId = parseInt(categoriaId);
  if (preco !== undefined) produto.preco = parseFloat(preco);
  if (estoqueMinimo !== undefined) produto.estoqueMinimo = parseInt(estoqueMinimo);
  if (fornecedorId) produto.fornecedorId = parseInt(fornecedorId);

  res.json({ mensagem: 'Produto atualizado com sucesso.', produto });
});

app.post('/produtos/:id/entrada', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const { quantidade } = req.body;

  if (!quantidade) {
    return res.status(400).json({ erro: 'A quantidade de reposição deve ser maior que zero.' });
  } else {
    if (quantidade <= 0) {
      return res.status(400).json({ erro: 'A quantidade de reposição deve ser maior que zero.' });
    }
  }

  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  produto.quantidadeEstoque += parseInt(quantidade);

  res.json({
    mensagem: 'Entrada de estoque realizada com sucesso.',
    produtoId: produto.id,
    novoEstoque: produto.quantidadeEstoque
  });
});

app.delete('/produtos/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const indice = produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  produtos.splice(indice, 1);
  res.json({ mensagem: 'Produto removido do sistema com sucesso.' });
});

app.get('/vendas', (req, res) => {
  res.json(vendas);
});

app.get('/vendas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const venda = vendas.find(v => v.id === id);

  if (!venda) {
    return res.status(404).json({ erro: 'Venda não encontrada.' });
  }

  res.json(venda);
});

app.post('/vendas', auth, (req, res) => {
  const { itens } = req.body;

  if (!itens) {
    return res.status(400).json({ erro: 'A venda deve possuir ao menos um item.' });
  } else {
    if (!Array.isArray(itens)) {
      return res.status(400).json({ erro: 'A venda deve possuir ao menos um item.' });
    } else {
      if (itens.length === 0) {
        return res.status(400).json({ erro: 'A venda deve possuir ao menos um item.' });
      }
    }
  }

  for (const item of itens) {
    const prod = produtos.find(p => p.id === parseInt(item.produtoId));

    if (!prod) {
      return res.status(404).json({ erro: `Produto de ID ${item.produtoId} não encontrado.` });
    }

    if (prod.quantidadeEstoque < item.quantidade) {
      return res.status(400).json({
        erro: `Estoque insuficiente para o produto: ${prod.nome}. Disponível: ${prod.quantidadeEstoque}`
      });
    }
  }

  let valorTotal = 0;

  const itensVenda = itens.map(item => {
    const prod = produtos.find(p => p.id === parseInt(item.produtoId));

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

  res.status(201).json({
    mensagem: 'Venda realizada com sucesso!',
    venda: novaVenda
  });
});

app.delete('/vendas/:id/cancelar', auth, (req, res) => {
  const vendaId = parseInt(req.params.id);
  const venda = vendas.find(v => v.id === vendaId);

  if (!venda) {
    return res.status(404).json({ erro: 'Venda não encontrada.' });
  }

  if (venda.status === 'CANCELADA') {
    return res.status(400).json({ erro: 'Esta venda já se encontra cancelada.' });
  }

  const dataVenda = new Date(venda.data).toDateString();
  const hoje = new Date().toDateString();

  if (dataVenda !== hoje) {
    return res.status(400).json({
      erro: 'RN02: O cancelamento só é permitido no mesmo dia em que a venda foi realizada.'
    });
  }

  venda.itens.forEach(item => {
    const prod = produtos.find(p => p.id === item.produtoId);

    if (prod) {
      prod.quantidadeEstoque += item.quantidade;
    }
  });

  venda.status = 'CANCELADA';

  res.json({
    mensagem: 'Venda cancelada com sucesso. Itens devolvidos ao estoque.',
    venda
  });
});

app.get('/relatorios/vendas', (req, res) => {
  const vendasConcluidas = vendas.filter(v => v.status === 'CONCLUIDA');
  const totalFaturado = vendasConcluidas.reduce((acc, v) => acc + v.valorTotal, 0);

  res.json({
    totalVendasRealizadas: vendasConcluidas.length,
    faturamentoTotal: totalFaturado,
    vendas: vendasConcluidas
  });
});

app.get('/relatorios/estoque-baixo', (req, res) => {
  const relatorio = produtos
    .filter(p => p.quantidadeEstoque <= p.estoqueMinimo)
    .map(p => ({
      id: p.id,
      nome: p.nome,
      quantidadeEstoque: p.quantidadeEstoque,
      estoqueMinimo: p.estoqueMinimo,
      status: p.quantidadeEstoque === 0
        ? 'CRÍTICO (SEM ESTOQUE)'
        : 'BAIXO'
    }));

  res.json({
    totalItensNecessitamReposicao: relatorio.length,
    itens: relatorio
  });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada no servidor.' });
});

const PORTA = 3000;

app.listen(PORTA, () => {
  console.log(`Servidor ativo e rodando na porta ${PORTA}`);
});