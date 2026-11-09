export const auth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token !== 'Bearer token-secreto-123') {
    return res.status(401).json({ erro: 'Acesso negado. Token de autenticação inválido ou ausente.' });
  }

  next();
};