import React from 'react';

const GenerarCodigo = ({ generarCodigo, nombre }) => (
  <button onClick={generarCodigo}>Generar de {nombre}</button>
);

export default GenerarCodigo;