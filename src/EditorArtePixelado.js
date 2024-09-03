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
  const [anchoLienzo, setAnchoLienzo] = useState(38);
  const [altoLienzo, setAltoLienzo] = useState(34);
  const [tamanoCelda, setTamanoCelda] = useState(18);
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

  const [mostrarControlTamanio, setMostrarControlTamanio] = useState(true);

  useEffect(() => {
    setPixeles(Array(anchoLienzo * altoLienzo).fill(''));
  }, [anchoLienzo, altoLienzo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarControlTamanio(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleControlTamanio = () => {
    setMostrarControlTamanio(prev => !prev);
  };

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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      minHeight: '100vh'
    }} onContextMenu={(e) => e.preventDefault()}>
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1001,
              cursor: 'pointer',
              backgroundColor: 'white',
              padding: '0.5rem',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} onClick={toggleControlTamanio}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{
                fill: 'rgba(0, 0, 0, 1)',
                transform: 'rotate(0deg)',
                transition: 'transform 1s linear'
              }}>
                <path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path>
                <path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path>
              </svg>
            </div>
            <div style={{
              position: 'absolute',
              top: '55px',
              left: mostrarControlTamanio ? '10px' : '-250px',
              zIndex: 1000,
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'left 0.3s ease-in-out'
            }}>
              <ControlTamanio
                anchoLienzo={anchoLienzo}
                setAnchoLienzo={setAnchoLienzo}
                altoLienzo={altoLienzo}
                setAltoLienzo={setAltoLienzo}
                tamanoCelda={tamanoCelda}
                setTamanoCelda={setTamanoCelda}
              />
            </div>

      <h1 style={{ color: '#333', marginBottom: '1rem' }}>PixelArt → OpenGL</h1>
      
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
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
            imagenFondo={imagenFondo}
          />

        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>  
          <SubidorImagen setImagenFondo={setImagenFondo} />
          {imagenFondo && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <img src={imagenFondo} alt="Previsualización" style={{ width: '210px', height: '225px', objectFit: 'contain', borderRadius: '10px', border: '2px solid #ccc' }} />
              <ControlFondo
                posicionFondo={posicionFondo}
                setPosicionFondo={setPosicionFondo}
                escalaFondo={escalaFondo}
                setEscalaFondo={setEscalaFondo}
                mostrarFondo={mostrarFondo}
                setMostrarFondo={setMostrarFondo}
              />
            </div>
          )}
        </div>
      </div>
      
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