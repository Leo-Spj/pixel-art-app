export const generadorCodigoPixelMiniWin = (coloresGuardados, pixeles, anchoLienzo, altoLienzo) => {
    let colorFunctions = '';
    let filas = {};

    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);
        colorFunctions += `
        if (color == "${alias}") {
            color_rgb(${r}, ${g}, ${b});
        }`;
    });

    pixeles.forEach((colorPixel, indice) => {
        const x = indice % anchoLienzo;
        const y = Math.floor(indice / anchoLienzo);
        const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || '';
        if (!filas[y]) {
            filas[y] = [];
        }
        filas[y][x] = aliasActual;
    });

    let drawCommands = '';
    Object.entries(filas).forEach(([fila, colores]) => {
        const coloresFila = colores.map(color => color === '' ? '""' : `"${color}"`).join(', ');
        drawCommands += `    dibujaFila(${fila}, {${coloresFila}});\n`;
    });

    return `
#include "miniwin.h"
#include <string>
#include <vector>

using namespace miniwin;
using namespace std;

const int escalado = 10;  // <-------------------- Escalado de los cuadrados
const bool pintarBorde = false; // <-------------------- Pintar borde de los cuadrados

void colores(const string& color) {${colorFunctions}
}

void dibujaCuadrado(int a, int b, const string& colorRelleno) {
    if (colorRelleno.empty()) return; // No dibujar nada si el color es una cadena vacía
    const int x = a * escalado;
    const int y = b * escalado;
    colores(colorRelleno);
    rectangulo_lleno(x, y, x + escalado, y + escalado);
    if (pintarBorde) {
        color_rgb(100, 100, 100); // <-------------------- Color plomo para el borde
        linea(x, y, x, y + escalado);
        linea(x, y + escalado, x + escalado, y + escalado);
        linea(x + escalado, y + escalado, x + escalado, y);
        linea(x + escalado, y, x, y);
    }
}

void dibujaFila(int fila, const vector<string>& colores) {
    for (int i = 0; i < colores.size(); ++i) {
        if (!colores[i].empty()) { // Verificar que el color no sea nulo o una cadena vacía
            dibujaCuadrado(i, fila, colores[i]);
        }
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