import React from 'react';

const ColoresGuardados = ({ coloresGuardados, aplicarColorGuardado, eliminarColorGuardado }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
    {Object.entries(coloresGuardados).map(([alias, colorGuardado]) => (
      <div key={alias} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => aplicarColorGuardado(alias)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: colorGuardado,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {alias}
        </button>
        <button
          onClick={() => eliminarColorGuardado(alias)}
          style={{
            padding: '0.5rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          X
        </button>
      </div>
    ))}
  </div>
);

export default ColoresGuardados;