import React, { useRef, useState, useEffect } from 'react';

const SelectorColor = ({ color, setColor, setAlias, guardarColor }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [contadorAlias, setContadorAlias] = useState(1); // Iniciar en 1 ya que 'a' es el primer alias

  const manejarClicCirculo = () => {
    inputRef.current.click();
  };

  const generarAlias = (contador) => {
    let alias = '';
    while (contador >= 0) {
      alias = String.fromCharCode(97 + (contador % 26)) + alias;
      contador = Math.floor(contador / 26) - 1;
    }
    return alias;
  };

  const manejarCambioColor = (e) => {
    const nuevoColor = e.target.value;
    setColor(nuevoColor);
    const nuevoAlias = generarAlias(contadorAlias);
    setAlias(nuevoAlias);
    setContadorAlias(contadorAlias + 1);
  };

  useEffect(() => {
    if (error) {
      const temporizador = setTimeout(() => {
        setError('');
      }, 3500);
      return () => clearTimeout(temporizador);
    }
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div 
          onClick={manejarClicCirculo}
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: color,
            cursor: 'pointer',
            border: '2px solid #fff',
            boxShadow: '0 0 0 2px #ccc',
            position: 'relative'
          }}
        >
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={manejarCambioColor}
            style={{
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
          />
        </div>
        <button 
          onClick={guardarColor}
          style={{
            border: '0px solid #333',
            padding: '.5rem 3rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontSize: '14px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Guardar color
        </button>
      </div>
      {error && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          animation: 'fadeOut 3.5s forwards',
          animationDelay: '2s' // Delay before starting the fade out
        }}>
          {error}
        </div>
      )}
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            90% { opacity: 1; } // Stay visible for most of the time
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default SelectorColor;