import React from 'react';

const SelectorColor = ({ color, setColor, alias, setAlias, guardarColor }) => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      style={{ width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '5px' }}
    />
    <input
      type="text"
      value={alias}
      onChange={(e) => setAlias(e.target.value)}
      placeholder="Alias del color"
      style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '230px'  }}
    />
    <button onClick={guardarColor} style={{
      padding: '0.5rem 1rem',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}>Guardar color</button>
  </div>
);

export default SelectorColor;