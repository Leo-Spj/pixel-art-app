import React from 'react';

const GeneradorCodigo = ({ coloresGuardados, pixeles, anchoLienzo, altoLienzo, generarCodigoCompleto }) => {
  const copiarAlPortapapeles = () => {
    const codigoCompleto = generarCodigoCompleto(coloresGuardados, pixeles, anchoLienzo, altoLienzo);
    navigator.clipboard.writeText(codigoCompleto)
      .then(() => alert('¡Copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar: ', err));
  };

  return (
    <button onClick={copiarAlPortapapeles} style={{
      padding: '0.5rem 1rem',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}>Copiar para OpenGL</button>
  );
};

export default GeneradorCodigo;