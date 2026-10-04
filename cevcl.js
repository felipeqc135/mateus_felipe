const express = require('express');
const app = express();
app.use(express.json());

let fornecedores = [{ id: 1, nome: 'Distribuidora Silva', cnpj: '12.345.678/0001-90' }];
let produtos = [{ id: 1, nome: 'Café 500g', preco: 18.5, quantidadeEstoque: 20, estoqueMinimo: 5, fornecedorId: 1 }];
let vendas = [];

const auth = (req, res, next) => {
  if (req.headers['authorization'] !== 'Bearer token-secreto-123') {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  next();
};

app.get('/', (req, res) => res.json({ status: 'API de Estoque Online' }));

app.get('/fornecedores', (req, res) => res.json(fornecedores));
app.post('/fornecedores', auth, (req, res) => {
  const { nome, cnpj } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome e CNPJ obrigatórios' });
  if (!cnpj) return res.status(400).json({ erro: 'Nome e CNPJ obrigatórios' });
  
  const novo = { id: fornecedores.length + 1, nome, cnpj };
  fornecedores.push(novo);
  res.status(201).json(novo);
});

app.get('/produtos', (req, res) => {
  const { busca } = req.query;
  const lista = busca ? produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())) : produtos;
  res.json(lista);
});

app.get('/produtos/alerta-estoque', (req, res) => {
  res.json(produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo));
});

app.get('/produtos/:id', (req, res) => {
  const prod = produtos.find(p => p.id === parseInt(req.params.id));
  prod ? res.json(prod) : res.status(404).json({ erro: 'Produto não encontrado' });
});

app.post('/produtos', auth, (req, res) => {
  const { nome, preco, quantidadeEstoque, estoqueMinimo, fornecedorId } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });
  if (preco === undefined) return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });
  if (quantidadeEstoque === undefined) return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });
  if (!fornecedorId) return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios' });

  const min = estoqueMinimo ? estoqueMinimo : 5;
  const novo = { id: produtos.length + 1, nome, preco: parseFloat(preco), quantidadeEstoque: parseInt(quantidadeEstoque), estoqueMinimo: min, fornecedorId: parseInt(fornecedorId) };
  produtos.push(novo);
  res.status(201).json(novo);
});

app.get('/vendas', (req, res) => res.json(vendas));

app.post('/vendas', auth, (req, res) => {
  const { itens } = req.body;
  if (!itens) return res.status(400).json({ erro: 'Venda sem itens' });
  if (!itens.length) return res.status(400).json({ erro: 'Venda sem itens' });

  for (const item of itens) {
    const prod = produtos.find(p => p.id === parseInt(item.produtoId));
    if (!prod) return res.status(404).json({ erro: `Produto ${item.produtoId} não encontrado` });
    if (prod.quantidadeEstoque < item.quantidade) {
      return res.status(400).json({ erro: `Estoque insuficiente para ${prod.nome}` });
    }
  }

  let valorTotal = 0;
  const itensVenda = itens.map(item => {
    const prod = produtos.find(p => p.id === parseInt(item.produtoId));
    prod.quantidadeEstoque -= item.quantidade;
    const subtotal = prod.preco * item.quantidade;
    valorTotal += subtotal;
    return { produtoId: prod.id, nome: prod.nome, quantidade: item.quantidade, subtotal };
  });

  const novaVenda = { id: vendas.length + 1, data: new Date().toISOString(), valorTotal, itens: itensVenda };
  vendas.push(novaVenda);
  res.status(201).json({ mensagem: 'Venda realizada', venda: novaVenda });
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.listen(3000, () => console.log('Rodando em http://localhost:3000'));