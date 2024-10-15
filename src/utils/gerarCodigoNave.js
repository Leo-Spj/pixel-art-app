export const gerarCodigoNave = (coloresGuardados, pixeles, anchoLienzo) => {
    let colorFunctions = '';
    let filas = {};

    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
        const r = parseInt(colorHex.slice(1, 3), 16);
        const g = parseInt(colorHex.slice(3, 5), 16);
        const b = parseInt(colorHex.slice(5, 7), 16);
        colorFunctions += `{"${alias}", {${r}, ${g}, ${b}}},\n`;
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
        drawCommands += `dibujaFila(${fila}, {${coloresFila}});\n`;
    });

    return `setColor(color, {\n${colorFunctions}});\n\n${drawCommands}`;
};