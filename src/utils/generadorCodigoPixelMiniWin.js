import { calcularCoordenadas } from './coordenadas';

export const generadorCodigoPixelMiniWin = (coloresGuardados, pixeles, anchoLienzo, altoLienzo) => {
    let colorFunctions = '';
    let drawCommands = '';

    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);
        colorFunctions += `
        case '${alias}':
            color_rgb(${r}, ${g}, ${b});
            break;`;
    });

    const pixelCommands = pixeles.map((colorPixel, indice) => {
        if (colorPixel) {
            const x = indice % anchoLienzo;
            const y = Math.floor(indice / anchoLienzo);
            // Ajustamos las coordenadas para corregir la orientación
            const xAjustado = x;
            const yAjustado = y; // Eliminamos la inversión de Y
            const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || 'ColorSinNombre';
            return `    dibujaCuadrado(${xAjustado * 10}, ${yAjustado * 10}, 10, '${aliasActual}', 'N');`;
        }
        return null;
    }).filter(Boolean);

    drawCommands = pixelCommands.join('\n');

    return `
#include "miniwin.h"

using namespace miniwin;

void colores(char choice) {
    switch (choice) {${colorFunctions}
    }
}

void dibujaCuadrado(int x, int y, int tamano, char colorRelleno, char colorBorde) {
    colores(colorRelleno);
    rectangulo_lleno(x, y, x + tamano, y + tamano);
    colores(colorBorde);
    linea(x, y, x, y + tamano);
    linea(x, y + tamano, x + tamano, y + tamano);
    linea(x + tamano, y + tamano, x + tamano, y);
    linea(x + tamano, y, x, y);
}

int main() {
    vredimensiona(${anchoLienzo * 10}, ${altoLienzo * 10});

    // Dibujando
${drawCommands}

    refresca();
    return 0;
}
`;
};