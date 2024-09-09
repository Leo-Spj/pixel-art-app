import React, { useState } from 'react';
import JSZip from 'jszip';
import CargarArchivo from './CargarArchivo';
import GenerarCodigo from './GenerarCodigo';
import MostrarCodigo from './MostrarCodigo';
import { parsearArchivoObj_Tinkercad, parsearArchivoMtl_Tinkercad, generarCodigoOpenGL_Tinkercad } from './CodigoTinkercad';
import generarCodigoFiguroIo from './CodigoFiguroio';
import './ConversorObjOpenGl.css';

const ConversorObjOpenGl = () => {
  const [archivoObj, setArchivoObj] = useState('');
  const [archivoMtl, setArchivoMtl] = useState('');
  const [codigo, setCodigo] = useState('');
  const [exitoCopia, setExitoCopia] = useState('');

  const manejarCargaZip = (event) => {
    const archivo = event.target.files[0];
    const lector = new FileReader();

    lector.onload = async (e) => {
      const zip = await JSZip.loadAsync(e.target.result);
      let objEncontrado = false;
      let mtlEncontrado = false;

      // Buscar el primer archivo .obj y .mtl dentro del .zip
      zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.name.endsWith('.obj') && !objEncontrado) {
          zipEntry.async('text').then((contenidoObj) => {
            setArchivoObj(contenidoObj);
          });
          objEncontrado = true;
        }
        if (zipEntry.name.endsWith('.mtl') && !mtlEncontrado) {
          zipEntry.async('text').then((contenidoMtl) => {
            setArchivoMtl(contenidoMtl);
          });
          mtlEncontrado = true;
        }
      });

      if (!objEncontrado || !mtlEncontrado) {
        alert('No se encontraron archivos OBJ o MTL en el ZIP');
      }
    };

    lector.readAsArrayBuffer(archivo);
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
      <CargarArchivo etiqueta="Subir ZIP:" aceptar=".zip" manejarCarga={manejarCargaZip} />
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
