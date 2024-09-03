import React from 'react';

const ControlFondo = ({ posicionFondo, setPosicionFondo, escalaFondo, setEscalaFondo, mostrarFondo, setMostrarFondo }) => {
  const moverFondo = (dx, dy) => {
    setPosicionFondo(anterior => ({ x: anterior.x + dx, y: anterior.y + dy }));
  };

  const escalarFondo = (delta) => {
    setEscalaFondo(anterior => Math.max(0.1, Math.min(5, anterior + delta)));
  };

  const styles = {
    container: {
      width: '150px',
      height: '195px',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center',
      // border: '1px solid #ddd',
      // borderRadius: '8px',
      // backgroundColor: '#fff',
      // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '5px',
      width: '90px',
      height: '60px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '1px solid #333',
      backgroundColor: '#007bff',
      color: '#fff',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    zoomButton: {
      padding: '5px 10px',
      borderRadius: '5px',
      border: '0px solid #333',
      backgroundColor: '#28a745',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      margin: '0 2px',
      transition: 'background-color 0.3s',
    },
    input: {
      width: '56px',
      padding: '5px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      textAlign: 'center',
    },
    label: {
      color: '#333',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <button onClick={() => moverFondo(0, -1)} style={styles.button}>↑</button>
        <button onClick={() => moverFondo(-1, 0)} style={styles.button}>←</button>
        <button onClick={() => moverFondo(1, 0)} style={styles.button}>→</button>
        <button onClick={() => moverFondo(0, 1)} style={styles.button}>↓</button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <input
          type="number"
          value={posicionFondo.x}
          onChange={(e) => setPosicionFondo(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
          placeholder="X"
          style={styles.input}
        />
        <input
          type="number"
          value={posicionFondo.y}
          onChange={(e) => setPosicionFondo(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
          placeholder="Y"
          style={styles.input}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
        <button onClick={() => escalarFondo(0.01)} style={styles.zoomButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >Zoom +</button>
        <button onClick={() => escalarFondo(-0.01)} style={styles.zoomButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >Zoom -</button>
      </div>
      <input
        type="number"
        value={escalaFondo}
        onChange={(e) => setEscalaFondo(parseFloat(e.target.value) || 1)}
        step="0.1"
        style={styles.input}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <label htmlFor="mostrarFondo" style={styles.label}>Mostrar fondo</label>
        <input
          type="checkbox"
          id="mostrarFondo"
          checked={mostrarFondo}
          onChange={(e) => setMostrarFondo(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default ControlFondo;