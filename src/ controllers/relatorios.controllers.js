import * as vendaService from '../services/vendas.services.js';

export const vendas = (req, res) => {
  res.json(vendaService.relatorioVendas());
};

export const estoqueBaixo = (req, res) => {
  res.json(vendaService.relatorioEstoqueBaixo());
};