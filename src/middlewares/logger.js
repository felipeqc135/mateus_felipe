export const logger = (req, res, next) => {
  const dataAtual = new Date().toISOString();
  console.log(`[${dataAtual}] ${req.method} em ${req.url}`);
  next();
};