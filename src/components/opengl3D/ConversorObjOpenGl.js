import React, { useState } from 'react';
import CargarArchivo from './CargarArchivo';
import GenerarCodigo from './GenerarCodigo';
import MostrarCodigo from './MostrarCodigo';
import { parsearArchivoObj_Tinkercad, parsearArchivoMtl_Tinkercad, generarCodigoOpenGL_Tinkercad } from './CodigoTinkercad';
import { parsearArchivoObj_FiguroIo, parsearArchivoMtl_FiguroIo, generarCodigoOpenGL_FiguroIo } from './CodigoFiguroio';
import generarCodigoFiguroIo from './CodigoFiguroio';
import './ConversorObjOpenGl.css';

const ConversorObjOpenGl = () => {
  const [archivoObj, setArchivoObj] = useState('');
  const [archivoMtl, setArchivoMtl] = useState('');
  const [codigo, setCodigo] = useState('');
  const [exitoCopia, setExitoCopia] = useState('');

  const manejarCargaArchivo = (event, setArchivo) => {
    const archivo = event.target.files[0];
    const lector = new FileReader();
    lector.onload = (e) => setArchivo(e.target.result);
    lector.readAsText(archivo);
  };

  const generarCodigoTinkercad = () => {
    const obj = parsearArchivoObj_Tinkercad(archivoObj);
    const materiales = parsearArchivoMtl_Tinkercad(archivoMtl);
    const codigo = generarCodigoOpenGL_Tinkercad(obj, materiales);
    setCodigo(codigo);
  };

  


  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(codigo).then(() => {
      setExitoCopia('Código copiado al portapapeles!');
      setTimeout(() => setExitoCopia(''), 2000);
    }, () => {
      setExitoCopia('Error al copiar el código.');
    });
  };

  return (
    <div className="conversor-card">
      <h2>Convertidor OBJ a OpenGL</h2>
      <CargarArchivo etiqueta="Subir OBJ:" aceptar=".obj" manejarCarga={(e) => manejarCargaArchivo(e, setArchivoObj)} />
      <CargarArchivo etiqueta="Subir MTL:" aceptar=".mtl" manejarCarga={(e) => manejarCargaArchivo(e, setArchivoMtl)} />
      <GenerarCodigo generarCodigo={generarCodigoTinkercad} nombre="Tinkercad" />
      <GenerarCodigo
        generarCodigo={() => generarCodigoFiguroIo(setCodigo, archivoObj, archivoMtl)}
        nombre="Figuro.io"
      />
      <MostrarCodigo codigo={codigo} copiarAlPortapapeles={copiarAlPortapapeles} exitoCopia={exitoCopia} />
    </div>
  );
};

export default ConversorObjOpenGl;