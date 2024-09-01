import React from 'react';

const ControlFondo = ({ posicionFondo, setPosicionFondo, escalaFondo, setEscalaFondo, mostrarFondo, setMostrarFondo, imagenFondo }) => {
  const moverFondo = (dx, dy) => {
    setPosicionFondo(anterior => ({ x: anterior.x + dx, y: anterior.y + dy }));
  };

  const escalarFondo = (delta) => {
    setEscalaFondo(anterior => Math.max(0.1, Math.min(5, anterior + delta)));
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button onClick={() => moverFondo(0, -1)}>↑</button>
          <button onClick={() => moverFondo(0, 1)}>↓</button>
          <button onClick={() => moverFondo(-1, 0)}>←</button>
          <button onClick={() => moverFondo(1, 0)}>→</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="number"
            value={posicionFondo.x}
            onChange={(e) => setPosicionFondo(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
            placeholder="X"
            style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            value={posicionFondo.y}
            onChange={(e) => setPosicionFondo(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
            placeholder="Y"
            style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => escalarFondo(0.1)}>Zoom +</button>
          <button onClick={() => escalarFondo(-0.1)}>Zoom -</button>
          <input
            type="number"
            value={escalaFondo}
            onChange={(e) => setEscalaFondo(parseFloat(e.target.value) || 1)}
            step="0.1"
            style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <label htmlFor="mostrarFondo">Mostrar fondo</label>
          <input
            type="checkbox"
            id="mostrarFondo"
            checked={mostrarFondo}
            onChange={(e) => setMostrarFondo(e.target.checked)}
          />
        </div>
      </div>
      <div>
        <img src={imagenFondo} alt="Previsualización" style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
      </div>
    </div>
  );
};

export default ControlFondo;