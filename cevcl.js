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