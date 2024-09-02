import React from 'react';

const ControlFondo = ({ posicionFondo, setPosicionFondo, escalaFondo, setEscalaFondo, mostrarFondo, setMostrarFondo, imagenFondo }) => {
  const moverFondo = (dx, dy) => {
    setPosicionFondo(anterior => ({ x: anterior.x + dx, y: anterior.y + dy }));
  };

  const escalarFondo = (delta) => {
    setEscalaFondo(anterior => Math.max(0.1, Math.min(5, anterior + delta)));
  };

  const buttonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #333',
    backgroundColor: '#555',
    color: '#fff',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  const zoomButtonStyle = {
    padding: '10px 20px',
    borderRadius: '20px',
    border: '2px solid #333',
    backgroundColor: '#555',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '0 5px',
  };

  const inputStyle = {
    width: '60px',
    padding: '10px',
    borderRadius: '10px',
    border: '2px solid #ccc',
    textAlign: 'center',
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '0.5rem', width: '140px', height: '140px' }}>
          <button onClick={() => moverFondo(0, -1)} style={{ ...buttonStyle, gridColumn: '2 / span 1', gridRow: '1 / span 1' }}>↑</button>
          <button onClick={() => moverFondo(-1, 0)} style={{ ...buttonStyle, gridColumn: '1 / span 1', gridRow: '2 / span 1' }}>←</button>
          <button onClick={() => moverFondo(1, 0)} style={{ ...buttonStyle, gridColumn: '3 / span 1', gridRow: '2 / span 1' }}>→</button>
          <button onClick={() => moverFondo(0, 1)} style={{ ...buttonStyle, gridColumn: '2 / span 1', gridRow: '3 / span 1' }}>↓</button>
        </div>
      
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <input
              type="number"
              value={posicionFondo.x}
              onChange={(e) => setPosicionFondo(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
              placeholder="X"
              style={inputStyle}
            />
            <input
              type="number"
              value={posicionFondo.y}
              onChange={(e) => setPosicionFondo(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
              placeholder="Y"
              style={inputStyle}
            />
          </div>
      
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => escalarFondo(0.01)} style={zoomButtonStyle}>Zoom +</button>
            <button onClick={() => escalarFondo(-0.01)} style={zoomButtonStyle}>Zoom -</button>
            <input
              type="number"
              value={escalaFondo}
              onChange={(e) => setEscalaFondo(parseFloat(e.target.value) || 1)}
              step="0.1"
              style={inputStyle}
            />
          </div>
      
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            <label htmlFor="mostrarFondo" style={{ color: '#333' }}>Mostrar fondo</label>
            <input
              type="checkbox"
              id="mostrarFondo"
              checked={mostrarFondo}
              onChange={(e) => setMostrarFondo(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <img src={imagenFondo} alt="Previsualización" style={{ width: '300px', height: '300px', objectFit: 'contain', borderRadius: '10px', border: '2px solid #ccc' }} />
      </div>
    </div>
  );
};

export default ControlFondo;
