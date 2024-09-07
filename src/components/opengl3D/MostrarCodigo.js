import React from 'react';

const MostrarCodigo = ({ codigo, copiarAlPortapapeles, exitoCopia }) => (
  <div>
    <textarea value={codigo} readOnly rows={20} placeholder="El código OpenGL generado aparecerá aquí..." />
    <button onClick={copiarAlPortapapeles}>Copiar</button>
    {exitoCopia && <div>{exitoCopia}</div>}
  </div>
);

export default MostrarCodigo;