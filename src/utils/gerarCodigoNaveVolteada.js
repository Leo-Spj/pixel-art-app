export const gerarCodigoNaveVolteada = (coloresGuardados, pixeles, anchoLienzo) => {
    let colorFunctions = '';
    let filas = {};

    // Generar funciones de color
    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);
        colorFunctions += `{"${alias}", {${r}, ${g}, ${b}}},\n`;
    });

    // Asignar píxeles a filas
    pixeles.forEach((colorPixel, indice) => {
        const x = indice % anchoLienzo;
        const y = Math.floor(indice / anchoLienzo);
        const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || '';
        if (!filas[y]) {
            filas[y] = [];
        }
        filas[y][x] = aliasActual;
    });

    // Invertir las filas
    const filasInvertidas = Object.entries(filas).reverse();

    // Generar comandos de dibujo
    let drawCommands = '';
    filasInvertidas.forEach(([fila, colores], index) => {
        const coloresFila = colores.map(color => color === '' ? '""' : `"${color}"`).join(', ');
        drawCommands += `dibujaFila(${index}, {${coloresFila}});\n`;
    });

    return `setColor(color, {\n${colorFunctions}});\n\n${drawCommands}`;
};