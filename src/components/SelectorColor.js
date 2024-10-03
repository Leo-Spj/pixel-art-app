import React, { useRef, useState, useEffect } from 'react';
import './SelectorColor.css';

const SelectorColor = ({ color, setColor, setAlias, guardarColor, coloresGuardados }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const manejarClicCirculo = () => {
    inputRef.current.click();
  };

  const generarAlias = () => {
    const aliasExistentes = Object.keys(coloresGuardados);
    const numeros = aliasExistentes
      .filter(alias => alias.startsWith('c_'))
      .map(alias => parseInt(alias.replace('c_', ''), 10))
      .filter(num => !isNaN(num));
    const maxNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
    return `c_${maxNumero + 1}`;
  };

  const manejarCambioColor = (e) => {
    const nuevoColor = e.target.value;
    setColor(nuevoColor);
    const nuevoAlias = generarAlias();
    setAlias(nuevoAlias);
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
    <div className="selector-color">
      <div className="color-picker-container">
        <div 
          onClick={manejarClicCirculo}
          className="color-circle"
          style={{ backgroundColor: color }}
        >
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={manejarCambioColor}
            className="color-input"
          />
        </div>
        <button 
          onClick={guardarColor}
          className="guardar-color-btn"
        >
          Guardar color
        </button>
      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectorColor;