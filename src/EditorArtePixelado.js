import React, { useState, useEffect, useCallback } from 'react';
import ControlTamanio from './components/ControlTamanio';
import SelectorColor from './components/SelectorColor';
import ColoresGuardados from './components/ColoresGuardados';
import SubidorImagen from './components/SubidorImagen';
import ControlFondo from './components/ControlFondo';
import Lienzo from './components/Lienzo';
import GeneradorCodigo from './components/GeneradorCodigo';
import ConversorObjOpenGl from './components/opengl3D/ConversorObjOpenGl';
import { generadorCodigoPixelMiniwin } from './utils/generadorCodigoPixelMiniWin';
import { generadorCodigoPixelOpenGl } from './utils/generadorCodigoPixelOpenGl';
import './EditorArtePixelado.css';
import IconoConfigLienzo from './ConfigLienzo.svg';
import IconoEstructuras3D from './IconoEstructuras3D.svg';


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
          <img src={IconoConfigLienzo} alt="Icono" />
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
        <img src={IconoEstructuras3D} alt="Icono Estructuras 3D" />
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
            coloresGuardados={coloresGuardados}
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
        nombre={"Generar para OpenGL"}
      />

      <GeneradorCodigo
        coloresGuardados={coloresGuardados}
        pixeles={pixeles}
        anchoLienzo={anchoLienzo}
        altoLienzo={altoLienzo}
        generarCodigoCompleto={generadorCodigoPixelMiniWin}
        nombre={"Generar para MiniWin"}
      />

      
    </div>
  );
};

export default EditorArtePixelado;