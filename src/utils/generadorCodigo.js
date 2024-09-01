import { calcularCoordenadas } from './coordenadas';

export const generarCodigoCompleto = (coloresGuardados, pixeles, anchoLienzo, altoLienzo) => {
    let enumCode = 'enum Color { ';
    let switchCode = '\tvoid pintarColor(Color color) {\n\t\tswitch(color) {\n';
    
    Object.entries(coloresGuardados).forEach(([alias, colorHex], index) => {
      enumCode += alias + (index < Object.entries(coloresGuardados).length - 1 ? ', ' : ' ');
      const r = parseInt(colorHex.slice(1, 3), 16) / 255;
      const g = parseInt(colorHex.slice(3, 5), 16) / 255;
      const b = parseInt(colorHex.slice(5, 7), 16) / 255;
      switchCode += `\t\t\tcase ${alias}: glColor3d(${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)});\n\t\t\tbreak;\n`;
    });
  
    enumCode += '};\n\n';
    switchCode += '\t\t}\n\t}\n\n';
  
    const pixelCommands = pixeles.map((colorPixel, indice) => {
      if (colorPixel) {
        const { x, y } = calcularCoordenadas(indice, anchoLienzo, altoLienzo);
        const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || 'ColorSinNombre';
        return `\t\tdibujarPixel(${x},${y},${aliasActual});`;
      }
      return null;
    }).filter(Boolean);
  
    const figuraCode = 'void figura() {\n' + pixelCommands.join('\n') + '\n\t}';
  
    return `
    double escalado = 0.5; // <- MODIFICA para ajustar el TAMAÑO de la figura
    
    void draw(){
        glClearColor(0.9,0.9,0.9,1);
        figura();
    }
    
    ${enumCode}${switchCode}
    void drawTriangle(double a1, double a2,
                      double b1, double b2,
                      double c1, double c2,
                      Color color
                      ){
        pintarColor(color);
        glBegin(GL_TRIANGLES);
        {
            glVertex2d(a1*escalado, a2*escalado);
            glVertex2d(b1*escalado, b2*escalado);
            glVertex2d(c1*escalado, c2*escalado);
        };
        glEnd();
    };
    
    void cuadrado_de2trinagulos(double a1, double a2, double b1, double b2, double c1, double c2, double d1, double d2, Color color){
        glBegin(GL_TRIANGLES);
        {
            drawTriangle(a1, a2, b1, b2, d1, d2, color);
            drawTriangle(b1, b2, c1, c2, d1, d2, color);
        }        
        glEnd();
    }
    
    void dibujarPixel(double a1, double a2, Color color) {
        const double lado = 1.0;
        double b1 = a1;
        double b2 = a2 + lado;
        double c1 = b1 + lado;
        double c2 = b2;
        double d1 = c1;
        double d2 = a2;
        cuadrado_de2trinagulos(a1, a2, b1, b2, c1, c2, d1, d2, color);
    }
    
    ${figuraCode}
    `;
};