import React from 'react';

const ControlTamanio = ({ anchoLienzo, setAnchoLienzo, altoLienzo, setAltoLienzo, tamanoCelda, setTamanoCelda }) => (
  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
    <input
      type="number"
      value={anchoLienzo}
      onChange={(e) => setAnchoLienzo(parseInt(e.target.value))}
      placeholder="Ancho"
      style={{ width: '60px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
    <input
      type="number"
      value={altoLienzo}
      onChange={(e) => setAltoLienzo(parseInt(e.target.value))}
      placeholder="Alto"
      style={{ width: '60px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
    <input
      type="number"
      value={tamanoCelda}
      onChange={(e) => setTamanoCelda(parseInt(e.target.value))}
      placeholder="Tamaño de celda"
      style={{ width: '100px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
    />
  </div>
);

export default ControlTamanio;