export let categorias = [
  { id: 1, nome: 'Bebidas' },
  { id: 2, nome: 'Alimentos' },
  { id: 3, nome: 'Limpeza' }
];

export const listarCategorias = () => categorias;

export const criarCategoria = (nome) => {
  const nova = { id: categorias.length + 1, nome };
  categorias.push(nova);
  return nova;
};