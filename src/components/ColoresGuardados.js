import React from 'react';

const ColoresGuardados = ({ coloresGuardados, aplicarColorGuardado, eliminarColorGuardado, imagenFondo }) => (
  <div style={{ 
    maxWidth: '600px',
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '0.5rem', 
    marginBottom: '1rem', 
    ...(imagenFondo ? { maxWidth: '240px' } : {})
  }}>
    {Object.entries(coloresGuardados).map(([alias, colorGuardado]) => (
      <div key={alias} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
        <button
          onClick={() => aplicarColorGuardado(alias)}
          style={{
            height: '35px',
            width: '35px',
            backgroundColor: colorGuardado,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
        </button>
                <button
          onClick={() => eliminarColorGuardado(alias)}
          style={{
            height: '35px',
            width: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: 'white' }}>
            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
            <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
          </svg>
        </button>
      </div>
    ))}
  </div>
);

export default ColoresGuardados;