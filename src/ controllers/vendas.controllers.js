import * as vendaService from '../services/vendas.services.js';

export const listar = (req, res) => {
  res.json(vendaService.listarVendas());
};

export const buscarPorId = (req, res) => {
  const venda = vendaService.buscarVendaPorId(parseInt(req.params.id));
  if (!venda) {
    return res.status(404).json({ erro: 'Venda não encontrada.' });
  }
  res.json(venda);
};

export const criar = (req, res) => {
  const { itens } = req.body;

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'A venda deve possuir ao menos um item.' });
  }

  try {
    const venda = vendaService.criarVenda(itens);
    res.status(201).json({ mensagem: 'Venda realizada com sucesso!', venda });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const cancelar = (req, res) => {
  const resultado = vendaService.cancelarVenda(parseInt(req.params.id));
  if (resultado.erro) {
    return res.status(resultado.status).json({ erro: resultado.erro });
  }

  res.json({
    mensagem: 'Venda cancelada com sucesso. Itens devolvidos ao estoque.',
    venda: resultado.venda
  });
};