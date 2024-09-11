import React, { useState, useEffect, useCallback } from 'react';
import ControlTamanio from './components/ControlTamanio';
import SelectorColor from './components/SelectorColor';
import ColoresGuardados from './components/ColoresGuardados';
import SubidorImagen from './components/SubidorImagen';
import ControlFondo from './components/ControlFondo';
import Lienzo from './components/Lienzo';
import GeneradorCodigo from './components/GeneradorCodigo';
import ConversorObjOpenGl from './components/opengl3D/ConversorObjOpenGl';
import { generadorCodigoPixelOpenGl } from './utils/generadorCodigoPixelOpenGl';
import './EditorArtePixelado.css';

const EditorArtePixelado = () => {
  const [anchoLienzo, setAnchoLienzo] = useState(36);
  const [altoLienzo, setAltoLienzo] = useState(28);
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
  const [mostrarControlConversor, setMostrarControlConversor] = useState(false);

  const toggleControlConversor = () => {
    setMostrarControlConversor(!mostrarControlConversor);
  };

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
    <div className="editor-container" onContextMenu={(e) => e.preventDefault()}>
      <div className="control-tamanio-toggle" onClick={toggleControlTamanio}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{
          fill: 'rgba(0, 0, 0, 1)',
          transform: 'rotate(0deg)',
          transition: 'transform 1s linear'
        }}>
          <path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path>
          <path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path>
        </svg>
      </div>
      <div className={`control-tamanio-container ${mostrarControlTamanio ? '' : 'hidden'}`}>
        <ControlTamanio
          anchoLienzo={anchoLienzo}
          setAnchoLienzo={setAnchoLienzo}
          altoLienzo={altoLienzo}
          setAltoLienzo={setAltoLienzo}
          tamanoCelda={tamanoCelda}
          setTamanoCelda={setTamanoCelda}
        />
      </div>

      <div className="control-conversor-toggle" onClick={toggleControlConversor}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
          <path fill="#000000" d="M29.5 8.5c8.9-.4 16.4 2.6 22.5 9 1 3-0 5-3 6-8.7-7.8-18.2-9-28.5-3.5-7 6.6-8.8 14.4-5.5 23.5 5.2-2.4 10.5-4.4 16-6 4.5 1.3 8.8 3 13 5 6-9.6 12.2-19.1 18.5-28.5 2.3-.7 4.7-.7 7 0 3.7 5.4 7 11 10 17-1 3-3 4-6 3-1.3-1.4-2.5-2.9-3.5-4.5-.3 11.3-.7 22.7-1 34-2.8 2.9-5.2 2.5-7-1-.3-11-.7-22-1-33-3.2 5.2-6.3 10.3-9.5 15.5 2.6.9 4.8 2.4 6.5 4.5.3 6.7.7 13.3 1 20 2.5 2.2 5.3 3 8.5 2.5 7.3-3.7 14.7-7.3 22-11-3.6-5.4-7.1-10.9-10.5-16.5-.7-5 1.3-6.7 6-5 4.4 7.2 8.6 14.5 12.5 22-.2 1.4-.7 2.8-1.5 4-9.1 5.5-18.6 10.3-28.5 14.5-3.2.5-6-.3-8.5-2.5-.8 2.1-2 3.9-3.5 5.5-8.1 4.4-16.4 8.2-25 11.5-3.4-1.2-6.8-2.7-10-4.5-2.9-3.2-2.4-5.7 1.5-7.5 1.4.8 2.9 1.4 4.5 2 1.2-7.3 1.3-14.6.5-22-4.1-1.8-8.3-3.7-12.5-5.5-.8-2-.1-3.8 0-5.5-.7.3-1.3.7-2 1-.1 8 .7 16 1.5 24 3.2 1.3 4.2 3.7 3 7-4.1 1.6-7.4.6-10-3-.7-10.7-.7-21.3 0-32 1.3-1.1 2.5-2.2 3.5-3.5-4.5-19.4 2.8-31.6 22-36.5zm-1 37c5.2.8 10.2 2.3 15 4.5-4.6 3.1-9.6 4.8-15 5-3.5-1.2-6.8-2.7-10-4.5 3.4-1.7 6.7-3.4 10-5zm22 10c1.2 6.8 1.3 13.8.5 21-5.1 2.8-10.3 5.5-15.5 8-1.2-7.3-1.3-14.6-.5-22 5.2-2.4 10.4-4.8 15.5-7z"/>
        </svg>
      </div>
      <div className={`control-conversor-container ${mostrarControlConversor ? 'visible' : 'hidden'}`}>
        <ConversorObjOpenGl />
      </div>
      
      <h1 className="header">PixelArt → OpenGL</h1>
      
      <div className="flex-container">
        <div className="flex-column">
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
        <div className="flex-column">
          <SubidorImagen setImagenFondo={setImagenFondo} />
          {imagenFondo && (
            <div className="flex-row">
              <img src={imagenFondo} alt="Previsualización" className="image-preview" />
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
        generarCodigoCompleto={generadorCodigoPixelOpenGl}
      />
    </div>
  );
};

export default EditorArtePixelado;