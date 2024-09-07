import React, { useState } from 'react';
import CargarArchivo from './CargarArchivo';
import GenerarCodigo from './GenerarCodigo';
import MostrarCodigo from './MostrarCodigo';
import './ConversorObjOpenGl.css';

const ConversorObjOpenGl = () => {
  const [archivoObj, setArchivoObj] = useState('');
  const [archivoMtl, setArchivoMtl] = useState('');
  const [codigoOpenGL, setCodigoOpenGL] = useState('');
  const [exitoCopia, setExitoCopia] = useState('');

  const manejarCargaArchivo = (event, setArchivo) => {
    const archivo = event.target.files[0];
    const lector = new FileReader();
    lector.onload = (e) => setArchivo(e.target.result);
    lector.readAsText(archivo);
  };

  const parsearArchivoObj = (contenidoObj) => {
    const lineas = contenidoObj.split('\n');
    const vertices = [];
    const caras = [];
    let materialActual = '';

    lineas.forEach(linea => {
      const partes = linea.trim().split(/\s+/);
      if (partes[0] === 'v') {
        vertices.push([parseFloat(partes[1]), parseFloat(partes[2]), parseFloat(partes[3])]);
      } else if (partes[0] === 'f') {
        caras.push({ vertices: partes.slice(1).map(f => parseInt(f.split('/')[0]) - 1), material: materialActual });
      } else if (partes[0] === 'usemtl') {
        materialActual = partes[1];
      }
    });

    return { vertices, caras };
  };

  const parsearArchivoMtl = (contenidoMtl) => {
    const lineas = contenidoMtl.split('\n');
    const materiales = {};
    let materialActual = '';

    lineas.forEach(linea => {
      const partes = linea.trim().split(/\s+/);
      if (partes[0] === 'newmtl') {
        materialActual = partes[1];
        materiales[materialActual] = {};
      } else if (partes[0] === 'Kd' && materialActual) {
        materiales[materialActual].color = partes.slice(1).map(parseFloat);
      }
    });

    return materiales;
  };

  const generarCodigoOpenGL = () => {
    const obj = parsearArchivoObj(archivoObj);
    const materiales = parsearArchivoMtl(archivoMtl);

    let codigo = `
void draw()
{
    camera();
    background();
    figura();
}

private:
    
    double escalado = 0.18;
        
        void background()
        { 
            glClearColor(0,0,0,1);
        }   
        
        void camera()
        {
            glRotated(-70,1,0,0);
            
            double ca;
            ca = 40*seconds();			
            glRotated(ca, 0,0,1);
        }
    
    void figura()
    {
        glPushMatrix();
        glScaled(escalado, escalado, escalado);
        glBegin(GL_TRIANGLES);
        ${obj.caras.map(cara => {
            const color = cara.material && materiales[cara.material] ? 
              `glColor3d(${materiales[cara.material].color.join(', ')});` : 
              'glColor3d(1.0, 1.0, 1.0); // Color por defecto si no se especifica material';
            return `
            ${color}
            ${cara.vertices.map(indiceVertice => {
                const vertice = obj.vertices[indiceVertice];
                return `glVertex3f(${vertice[0]}, ${vertice[1]}, ${vertice[2]});`;
            }).join('\n            ')}`;
        }).join('\n        ')}
        glEnd();
        glPopMatrix();
    }
`;

    setCodigoOpenGL(codigo);
  };

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(codigoOpenGL).then(() => {
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
      <GenerarCodigo generarCodigo={generarCodigoOpenGL} />
      <MostrarCodigo codigo={codigoOpenGL} copiarAlPortapapeles={copiarAlPortapapeles} exitoCopia={exitoCopia} />
    </div>
  );
};

export default ConversorObjOpenGl;