import React, { useState, useEffect, useCallback } from 'react';
import ControlTamanio from './components/ControlTamanio';
import SelectorColor from './components/SelectorColor';
import ColoresGuardados from './components/ColoresGuardados';
import SubidorImagen from './components/SubidorImagen';
import ControlFondo from './components/ControlFondo';
import Lienzo from './components/Lienzo';
import GeneradorCodigo from './components/GeneradorCodigo';
import ConversorObjOpenGl from './components/opengl3D/ConversorObjOpenGl';
import { generadorCodigoPixelMiniWin } from './utils/generadorCodigoPixelMiniWin';
import { generadorCodigoPixelOpenGl } from './utils/generadorCodigoPixelOpenGl';
import './EditorArtePixelado.css';
import IconoConfigLienzo from './ConfigLienzo.svg';
import IconoEstructuras3D from './IconoEstructuras3D.svg';
import { guardarLienzo, cargarLienzo, eliminarLienzo, obtenerLienzos } from './lienzoStorage'; // Importar las funciones
import { gerarCodigoNave } from './utils/gerarCodigoNave';
import { gerarCodigoNaveVolteada } from './utils/gerarCodigoNaveVolteada';

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
  const [nombreLienzo, setNombreLienzo] = useState('');
  const [lienzosGuardados, setLienzosGuardados] = useState([]);

  const toggleControlConversor = () => {
    setMostrarControlConversor(!mostrarControlConversor);
  };

  useEffect(() => {
    setPixeles(Array(anchoLienzo * altoLienzo).fill(''));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarControlTamanio(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLienzosGuardados(obtenerLienzos());
  }, []);

  const toggleControlTamanio = () => {
    setMostrarControlTamanio(prev => !prev);
  };

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
  }, [color, coloresGuardados, pintarPixel, borrarPixel]);

  const manejarMovimientoMouse = useCallback((indice) => {
    if (estaPintando) {
      pintarPixel(indice);
    } else if (estaBorrando) {
      borrarPixel(indice);
    }
  }, [estaPintando, estaBorrando, pintarPixel, borrarPixel]);

  const manejarFinPintado = useCallback(() => {
    setEstaPintando(false);
    setEstaBorrando(false);
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

  const manejarGuardarLienzo = () => {
    if (!nombreLienzo) {
      alert('Por favor, ingrese un nombre para el lienzo.');
      return;
    }
    guardarLienzo(nombreLienzo, coloresGuardados, pixeles, anchoLienzo, altoLienzo, tamanoCelda, imagenFondo, posicionFondo, escalaFondo, mostrarFondo);
    setLienzosGuardados(obtenerLienzos());
  };

  const manejarCargarLienzo = (nombre) => {
    cargarLienzo(nombre, setColoresGuardados, setPixeles, setAnchoLienzo, setAltoLienzo, setTamanoCelda, setImagenFondo, setPosicionFondo, setEscalaFondo, setMostrarFondo, anchoLienzo, altoLienzo);
  };

  const manejarEliminarLienzo = (nombre) => {
    eliminarLienzo(nombre);
    setLienzosGuardados(obtenerLienzos());
  };

  const desplazarDibujo = (direccion) => {
    setPixeles((pixelesAnteriores) => {
      const nuevosPixeles = Array(anchoLienzo * altoLienzo).fill('');
      if (direccion === 'arriba') {
        for (let y = 1; y < altoLienzo; y++) {
          for (let x = 0; x < anchoLienzo; x++) {
            nuevosPixeles[(y - 1) * anchoLienzo + x] = pixelesAnteriores[y * anchoLienzo + x];
          }
        }
      } else if (direccion === 'abajo') {
        for (let y = 0; y < altoLienzo - 1; y++) {
          for (let x = 0; x < anchoLienzo; x++) {
            nuevosPixeles[(y + 1) * anchoLienzo + x] = pixelesAnteriores[y * anchoLienzo + x];
          }
        }
      } else if (direccion === 'izquierda') {
        for (let y = 0; y < altoLienzo; y++) {
          for (let x = 1; x < anchoLienzo; x++) {
            nuevosPixeles[y * anchoLienzo + (x - 1)] = pixelesAnteriores[y * anchoLienzo + x];
          }
        }
      } else if (direccion === 'derecha') {
        for (let y = 0; y < altoLienzo; y++) {
          for (let x = 0; x < anchoLienzo - 1; x++) {
            nuevosPixeles[y * anchoLienzo + (x + 1)] = pixelesAnteriores[y * anchoLienzo + x];
          }
        }
      }
      return nuevosPixeles;
    });
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
          setPixeles={setPixeles}
        />
      </div>

      <div>
        <a href="https://github.com/Leo-Spj/pixel-art-app" className="github-button" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>

      <div className="control-conversor-toggle" onClick={toggleControlConversor}>
        <img src={IconoEstructuras3D} alt="Icono Estructuras 3D" />
      </div>
      <div className={`control-conversor-container ${mostrarControlConversor ? 'visible' : 'hidden'}`}>
        <ConversorObjOpenGl />
      </div>
      
      <h1 className="header">PixelArt</h1>
      
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

      <div className="contenedor-principal">
        <div className="sector">
          <div className="grid-desplazamiento">
            <button className="boton-invisible"></button>
            <button onClick={() => desplazarDibujo('arriba')}>&#9650;</button>
            <button className="boton-invisible"></button>
            <button onClick={() => desplazarDibujo('izquierda')}>&#9664;</button>
            <button className="boton-invisible"></button>
            <button onClick={() => desplazarDibujo('derecha')}>&#9654;</button>
            <button className="boton-invisible"></button>
            <button onClick={() => desplazarDibujo('abajo')}>&#9660;</button>
            <button className="boton-invisible"></button>
          </div>
        </div>
      
        <div className="sector-copiado">
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

          <GeneradorCodigo
            coloresGuardados={coloresGuardados}
            pixeles={pixeles}
            anchoLienzo={anchoLienzo}
            altoLienzo={altoLienzo}
            generarCodigoCompleto={gerarCodigoNave}
            nombre={"Generar nave"}
          />

          <GeneradorCodigo
            coloresGuardados={coloresGuardados}
            pixeles={pixeles}
            anchoLienzo={anchoLienzo}
            altoLienzo={altoLienzo}
            generarCodigoCompleto={gerarCodigoNaveVolteada}
            nombre={"Generar nave volteada"}
          />
        </div>
      
        <div className="sector">
          <input
            type="text"
            className="nombre-lienzo-input"
            placeholder="Nombre del lienzo"
            value={nombreLienzo}
            onChange={(e) => setNombreLienzo(e.target.value)}
          />
          <button className="guardar-lienzo-btn" onClick={manejarGuardarLienzo}>Guardar Lienzo</button>
        </div>
      </div>
      
      <div className="carrusel-lienzos">
        {lienzosGuardados.map((lienzo, index) => (
          <div key={index} className="lienzo-item">
            <span className="lienzo-nombre">{lienzo.nombre}</span>
            <button className="cargar-lienzo-btn" onClick={() => manejarCargarLienzo(lienzo.nombre)}>Cargar</button>
            <button className="eliminar-lienzo-btn" onClick={() => manejarEliminarLienzo(lienzo.nombre)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorArtePixelado;