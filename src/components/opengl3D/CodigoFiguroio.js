import React, { useState } from 'react';

const generarCodigoFiguroIo = (setCodigo, archivoObj, archivoMtl) => {
  const procesarArchivos = (objText, mtlText) => {
    const objLines = objText.split('\n');
    const mtlLines = mtlText.split('\n');
    const vertices = [];
    const materials = {};
    const output = [];

    let currentMaterial = null;
    mtlLines.forEach(line => {
      line = line.trim();
      if (line.startsWith('newmtl')) {
        currentMaterial = line.split(' ')[1];
      } else if (line.startsWith('Kd') && currentMaterial) {
        const kdValues = line.split(' ').slice(1).map(Number);
        materials[currentMaterial] = kdValues;
      }
    });

    let currentMaterialUsed = null;
    const faces = [];
    objLines.forEach(line => {
      line = line.trim();
      if (line.startsWith('v ')) {
        vertices.push(line.split(' ').slice(1).map(Number));
      } else if (line.startsWith('usemtl')) {
        currentMaterialUsed = line.split(' ')[1];
      } else if (line.startsWith('f ')) {
        faces.push({
          material: currentMaterialUsed,
          vertices: line.split(' ').slice(1).map(face => parseInt(face.split('/')[0], 10) - 1)
        });
      }
    });

    for (let i = 0; i < faces.length; i += 6) {
      const materialName = faces[i].material;
      const [r, g, b] = (materials[materialName] || [1.0, 1.0, 1.0]).map(color => color.toFixed(2));
    
      let minVertex = [Infinity, Infinity, Infinity];
      let maxVertex = [-Infinity, -Infinity, -Infinity];
    
      for (let j = 0; j < 6; j++) {
        const vertex = vertices[faces[i + j].vertices[0]];
        minVertex = [
          Math.min(minVertex[0], vertex[0]),
          Math.min(minVertex[1], vertex[1]),
          Math.min(minVertex[2], vertex[2])
        ];
        maxVertex = [
          Math.max(maxVertex[0], vertex[0]),
          Math.max(maxVertex[1], vertex[1]),
          Math.max(maxVertex[2], vertex[2])
        ];
      }
    
      const redondearAlMultiploMasCercano = (num) => (Math.round(num * 4) / 4).toFixed(2); // Redondear a múltiplos de 0.25
    
      const a1 = redondearAlMultiploMasCercano(minVertex[0] / 128);
      const a2 = redondearAlMultiploMasCercano(minVertex[1] / 128);
      const a3 = redondearAlMultiploMasCercano(minVertex[2] / 128);
      const b1 = redondearAlMultiploMasCercano(maxVertex[0] / 128);
      const b2 = redondearAlMultiploMasCercano(maxVertex[1] / 128);
      const b3 = redondearAlMultiploMasCercano(maxVertex[2] / 128);
    
      const funcStr = `cubo3d(${a1}, ${a2}, ${a3}, ${b1}, ${b2}, ${b3}, ${r}, ${g}, ${b});`;
      output.push(funcStr);
    }

    const classTemplate = `
public:

  void draw()
  {
    camera();
    background();
    figura();
  }

private:

  double escalado = 1.75;
		
  void background()
  { 
    glClearColor(0,0,0,1);
  }   
  
  void camera()
  {
    glTranslated(0.0, -10.0, -10.0);
    
    double ca;
    ca = 40 * seconds();
    glRotated(30, 1, 0, 0);
    glRotated(ca, 0, 1, 0);
  }
  
  void rectangulo3d(double x1, double y1, double z1, 
            double x2, double y2, double z2, 
            double x3, double y3, double z3, 
            double x4, double y4, double z4, 
            double r, double g, double b) 
  {
    glColor3d(r, g, b);
    glBegin(GL_QUADS);
    glVertex3d(x1 * escalado, y1 * escalado, z1 * escalado);
    glVertex3d(x2 * escalado, y2 * escalado, z2 * escalado);
    glVertex3d(x3 * escalado, y3 * escalado, z3 * escalado);
    glVertex3d(x4 * escalado, y4 * escalado, z4 * escalado);
    glEnd();
  }
  
  void cubo3d(double x1, double y1, double z1, double x7, double y7, double z7, double r, double g, double b) 
  {
    double x2 = x7; double y2 = y1; double z2 = z1;
    double x3 = x7; double y3 = y7; double z3 = z1;
    double x4 = x1; double y4 = y7; double z4 = z1;
    
    double x5 = x1; double y5 = y1; double z5 = z7;
    double x6 = x7; double y6 = y1; double z6 = z7;
    double x8 = x1; double y8 = y7; double z8 = z7;
    
    
    rectangulo3d(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, r, g, b); // Frente
    rectangulo3d(x5, y5, z5, x6, y6, z6, x7, y7, z7, x8, y8, z8, r, g, b); // Atrás
    rectangulo3d(x1, y1, z1, x5, y5, z5, x8, y8, z8, x4, y4, z4, r, g, b); // Izquierda
    rectangulo3d(x2, y2, z2, x6, y6, z6, x7, y7, z7, x3, y3, z3, r, g, b); // Derecha
    rectangulo3d(x4, y4, z4, x3, y3, z3, x7, y7, z7, x8, y8, z8, r, g, b); // Arriba
    rectangulo3d(x1, y1, z1, x2, y2, z2, x6, y6, z6, x5, y5, z5, r, g, b); // Abajo
  }

  void figura()
  {
    ${output.join('\n    ')}
  }
`;

    setCodigo(classTemplate);
  };

  if (archivoObj && archivoMtl) {
    procesarArchivos(archivoObj, archivoMtl);
  }
};

export default generarCodigoFiguroIo;