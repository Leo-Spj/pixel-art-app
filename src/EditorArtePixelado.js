import React, { useState, useEffect, useCallback } from 'react';
import ControlTamanio from './components/ControlTamanio';
import SelectorColor from './components/SelectorColor';
import ColoresGuardados from './components/ColoresGuardados';
import SubidorImagen from './components/SubidorImagen';
import ControlFondo from './components/ControlFondo';
import Lienzo from './components/Lienzo';
import GeneradorCodigo from './components/GeneradorCodigo';

import { generarCodigoCompleto } from './utils/generadorCodigo';

const EditorArtePixelado = () => {
  const [anchoLienzo, setAnchoLienzo] = useState(40);
  const [altoLienzo, setAltoLienzo] = useState(40);
  const [tamanoCelda, setTamanoCelda] = useState(16);
  const [color, setColor] = useState('#000000');
  const [pixeles, setPixeles] = useState([]);
  const [imagenFondo, setImagenFondo] = useState(null);
  const [posicionFondo, setPosicionFondo] = useState({ x: 0, y: 0 });
  const [escalaFondo, setEscalaFondo] = useState(1);
  const [coloresGuardados, setColoresGuardados] = useState({});
  const [alias, setAlias] = useState('');
  const [mostrarFondo, setMostrarFondo] = useState(true);

  const [estaPintando, setEstaPintando] = useState(false);
  const [estaBorrando, setEstaBorrando] = useState(false);

  useEffect(() => {
    setPixeles(Array(anchoLienzo * altoLienzo).fill(''));
  }, [anchoLienzo, altoLienzo]);

  const manejarClicPixel = useCallback((indice, evento) => {
    evento.preventDefault();
    if (!Object.values(coloresGuardados).includes(color)) {
      alert('Por favor, guarda el color con un alias antes de pintar.');
      return;
    }
    if (evento.button === 0) {
      setEstaPintando(true);
      pintarPixel(indice);
    } else if (evento.button === 2) {
      setEstaBorrando(true);
      borrarPixel(indice);
    }
  }, [color, coloresGuardados]);

  const manejarMovimientoMouse = useCallback((indice) => {
    if (estaPintando) {
      pintarPixel(indice);
    } else if (estaBorrando) {
      borrarPixel(indice);
    }
  }, [estaPintando, estaBorrando]);

  const manejarFinPintado = useCallback(() => {
    setEstaPintando(false);
    setEstaBorrando(false);
  }, []);

  const pintarPixel = useCallback((indice) => {
    setPixeles(pixelesAnteriores => {
      const nuevosPixeles = [...pixelesAnteriores];
      nuevosPixeles[indice] = color;
      return nuevosPixeles;
    });
  }, [color]);

  const borrarPixel = useCallback((indice) => {
    setPixeles(pixelesAnteriores => {
      const nuevosPixeles = [...pixelesAnteriores];
      nuevosPixeles[indice] = '';
      return nuevosPixeles;
    });
  }, []);

  const guardarColor = () => {
    if (alias && !coloresGuardados[alias]) {
      setColoresGuardados(anteriores => ({
        ...anteriores,
        [alias]: color
      }));
      setAlias('');
    }
  };

  const eliminarColorGuardado = (alias) => {
    const colorEnUso = coloresGuardados[alias];
    
    // Verificar si el color está siendo usado en el lienzo
    const estaEnUso = pixeles.some(pixelColor => pixelColor === colorEnUso);
    
    if (estaEnUso) {
      alert('No se puede eliminar el color porque está siendo usado en el lienzo.');
      return;
    }
    
    // Si no está en uso, procede a eliminarlo
    setColoresGuardados(anteriores => {
      const nuevosColores = { ...anteriores };
      delete nuevosColores[alias];
      return nuevosColores;
    });
  };
  
  const aplicarColorGuardado = (alias) => {
    if (coloresGuardados[alias]) {
      setColor(coloresGuardados[alias]);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }} onContextMenu={(e) => e.preventDefault()}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Editor de Arte Pixelado</h1>
      <ControlTamanio
        anchoLienzo={anchoLienzo}
        setAnchoLienzo={setAnchoLienzo}
        altoLienzo={altoLienzo}
        setAltoLienzo={setAltoLienzo}
        tamanoCelda={tamanoCelda}
        setTamanoCelda={setTamanoCelda}
      />
      <SelectorColor
        color={color}
        setColor={setColor}
        alias={alias}
        setAlias={setAlias}
        guardarColor={guardarColor}
      />
      <ColoresGuardados
        coloresGuardados={coloresGuardados}
        aplicarColorGuardado={aplicarColorGuardado}
        eliminarColorGuardado={eliminarColorGuardado}
      />
      <SubidorImagen setImagenFondo={setImagenFondo} />
      {imagenFondo && (
        <ControlFondo
          posicionFondo={posicionFondo}
          setPosicionFondo={setPosicionFondo}
          escalaFondo={escalaFondo}
          setEscalaFondo={setEscalaFondo}
          mostrarFondo={mostrarFondo}
          setMostrarFondo={setMostrarFondo}
          imagenFondo={imagenFondo}
        />
      )}
      <Lienzo
        anchoLienzo={anchoLienzo}
        altoLienzo={altoLienzo}
        tamanoCelda={tamanoCelda}
        pixeles={pixeles}
        manejarClicPixel={manejarClicPixel}
        manejarMovimientoMouse={manejarMovimientoMouse}
        manejarFinPintado={manejarFinPintado}
        imagenFondo={imagenFondo}
        posicionFondo={posicionFondo}
        escalaFondo={escalaFondo}
        mostrarFondo={mostrarFondo}
      />
      <GeneradorCodigo
        coloresGuardados={coloresGuardados}
        pixeles={pixeles}
        anchoLienzo={anchoLienzo}
        altoLienzo={altoLienzo}
        generarCodigoCompleto={generarCodigoCompleto}
      />
    </div>
  );
};

export default EditorArtePixelado;