export const calcularCoordenadas = (indice, anchoLienzo, altoLienzo) => {
  const x = indice % anchoLienzo - Math.floor(anchoLienzo / 2);
  const y = Math.floor(altoLienzo / 2) - Math.floor(indice / anchoLienzo);
  return { x, y };
};