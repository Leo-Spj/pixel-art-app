import { calcularCoordenadas } from './coordenadas';

export const generadorCodigoPixelMiniWin = (coloresGuardados, pixeles, anchoLienzo, altoLienzo) => {
    let colorFunctions = '';
    let drawCommands = '';

    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);
        colorFunctions += `
        if (color == "${alias}") {
            color_rgb(${r}, ${g}, ${b});
        }`;
    });

    const pixelCommands = pixeles.map((colorPixel, indice) => {
        if (colorPixel) {
            const x = indice % anchoLienzo;
            const y = Math.floor(indice / anchoLienzo);
            // Ajustamos las coordenadas para corregir la orientación
            const xAjustado = x;
            const yAjustado = y; // Eliminamos la inversión de Y
            const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || 'ColorSinNombre';
            return `    dibujaCuadrado(${xAjustado} * escalado, ${yAjustado} * escalado, "${aliasActual}");`;
        }
        return null;
    }).filter(Boolean);

    drawCommands = pixelCommands.join('\n');

    return `
#include "miniwin.h"
#include <string>

using namespace miniwin;
using namespace std;

const int escalado = 10;  // <-------------------- Escalado de los cuadrados
const bool pintarBorde = false; // <-------------------- Pintar borde de los cuadrados

void colores(const string& color) {${colorFunctions}
}

void dibujaCuadrado(int x, int y, const string& colorRelleno) {
    colores(colorRelleno);
    rectangulo_lleno(x, y, x + escalado, y + escalado);
    if (pintarBorde) {
        color_rgb(0, 0, 0); // <-------------------- Color negro para el borde
        linea(x, y, x, y + escalado);
        linea(x, y + escalado, x + escalado, y + escalado);
        linea(x + escalado, y + escalado, x + escalado, y);
        linea(x + escalado, y, x, y);
    }
}

int main() {
    vredimensiona(${anchoLienzo} * escalado, ${altoLienzo} * escalado);

    // Dibujando
${drawCommands}

    refresca();
    return 0;
}
`;
};