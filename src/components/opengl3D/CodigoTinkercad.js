
export const parsearArchivoObj_Tinkercad = (contenidoObj) => {
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

export const parsearArchivoMtl_Tinkercad = (contenidoMtl) => {
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

export const generarCodigoOpenGL_Tinkercad = (obj, materiales) => {
  let codigo = `
public:

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

  return codigo;
};