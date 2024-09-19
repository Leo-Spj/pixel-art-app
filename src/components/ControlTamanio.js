import React from 'react';

const ControlTamanio = ({ anchoLienzo, setAnchoLienzo, altoLienzo, setAltoLienzo, tamanoCelda, setTamanoCelda, setPixeles }) => {

  const handleAnchoChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) {
      value = 0;
    } else if (value % 2 !== 0) {
      // Redondea al par más cercano
      value = anchoLienzo > value ? value - 1 : value + 1;
    }
    setAnchoLienzo(value);
    ajustarPixeles(value, altoLienzo);
  };

  const handleAltoChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) {
      value = 0;
    } else if (value % 2 !== 0) {
      // Redondea al par más cercano
      value = altoLienzo > value ? value - 1 : value + 1;
    }
    setAltoLienzo(value);
    ajustarPixeles(anchoLienzo, value);
  };

  const handleTamanoCeldaChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) {
      value = 0;
    }
    setTamanoCelda(value);
  };

  const ajustarPixeles = (nuevoAncho, nuevoAlto) => {
    setPixeles((pixelesAnteriores) => {
      const nuevosPixeles = Array(nuevoAncho * nuevoAlto).fill('');
      for (let y = 0; y < Math.min(altoLienzo, nuevoAlto); y++) {
        for (let x = 0; x < Math.min(anchoLienzo, nuevoAncho); x++) {
          nuevosPixeles[y * nuevoAncho + x] = pixelesAnteriores[y * anchoLienzo + x];
        }
      }
      return nuevosPixeles;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label htmlFor="anchoLienzo" style={{ fontSize: '0.875rem' }}>Ancho del lienzo</label>
        <input
          id="anchoLienzo"
          type="number"
          value={anchoLienzo}
          onChange={handleAnchoChange}
          placeholder="Introduce el ancho"
          style={{ width: '120px', padding: '0.25rem', borderRadius: '3px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label htmlFor="altoLienzo" style={{ fontSize: '0.875rem' }}>Alto del lienzo</label>
        <input
          id="altoLienzo"
          type="number"
          value={altoLienzo}
          onChange={handleAltoChange}
          placeholder="Introduce el alto"
          style={{ width: '120px', padding: '0.25rem', borderRadius: '3px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label htmlFor="tamanoCelda" style={{ fontSize: '0.875rem' }}>Tamaño de la celda</label>
        <input
          id="tamanoCelda"
          type="number"
          value={tamanoCelda}
          onChange={handleTamanoCeldaChange}
          placeholder="Introduce el tamaño de la celda"
          style={{ width: '120px', padding: '0.25rem', borderRadius: '3px', border: '1px solid #ccc' }}
        />
      </div>
    </div>
  );
};

export default ControlTamanio;