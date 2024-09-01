import React, { useState, useRef, useEffect } from 'react';

const EditorArtePixelado = () => {
  const [anchoLienzo, setAnchoLienzo] = useState(16);
  const [altoLienzo, setAltoLienzo] = useState(16);
  const [color, setColor] = useState('#000000');
  const [pixeles, setPixeles] = useState([]);
  const [imagenFondo, setImagenFondo] = useState(null);
  const [posicionFondo, setPosicionFondo] = useState({ x: 0, y: 0 });
  const [escalaFondo, setEscalaFondo] = useState(1);
  const [coloresGuardados, setColoresGuardados] = useState({});
  const [alias, setAlias] = useState('');
  const refLienzo = useRef(null);

  useEffect(() => {
    setPixeles(Array(anchoLienzo * altoLienzo).fill(''));
  }, [anchoLienzo, altoLienzo]);

  const calcularCoordenadas = (indice) => {
    const x = indice % anchoLienzo - Math.floor(anchoLienzo / 2);
    const y = Math.floor(altoLienzo / 2) - Math.floor(indice / anchoLienzo);
    return { x, y };
  };

  const manejarClicPixel = (indice, evento) => {
    evento.preventDefault();
    if (evento.button === 0) {
      setPixeles(pixelesAnteriores => {
        const nuevosPixeles = [...pixelesAnteriores];
        nuevosPixeles[indice] = color;
        return nuevosPixeles;
      });
    } else if (evento.button === 2) {
      setPixeles(pixelesAnteriores => {
        const nuevosPixeles = [...pixelesAnteriores];
        nuevosPixeles[indice] = '';
        return nuevosPixeles;
      });
    }
  };

  const manejarCambioColor = (nuevoColor) => {
    setColor(nuevoColor);
  };

  const manejarSubidaImagen = (e) => {
    const archivo = e.target.files[0];
    const lector = new FileReader();
    lector.onload = (evento) => {
      setImagenFondo(evento.target.result);
      setPosicionFondo({ x: 0, y: 0 });
      setEscalaFondo(1);
    };
    lector.readAsDataURL(archivo);
  };

  const moverFondo = (dx, dy) => {
    setPosicionFondo(anterior => ({ x: anterior.x + dx, y: anterior.y + dy }));
  };

  const escalarFondo = (delta) => {
    setEscalaFondo(anterior => Math.max(0.1, Math.min(5, anterior + delta)));
  };

  const guardarColor = () => {
    if (alias && !coloresGuardados[alias]) {
      setColoresGuardados(anteriores => ({
        ...anteriores,
        [alias]: color
      }));
      setAlias('');
    }
  };

  const aplicarColorGuardado = (alias) => {
    if (coloresGuardados[alias]) {
      setColor(coloresGuardados[alias]);
    }
  };

  const generarEnumColor = () => {
    let enumCode = 'enum Color { ';
    let switchCode = 'void pintarColor(Color color) { switch(color) { ';

    Object.entries(coloresGuardados).forEach(([alias, colorHex]) => {
      enumCode += `${alias}, `;
      const r = parseInt(colorHex.slice(1, 3), 16) / 255;
      const g = parseInt(colorHex.slice(3, 5), 16) / 255;
      const b = parseInt(colorHex.slice(5, 7), 16) / 255;
      switchCode += `case ${alias}: glColor3d(${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}); break; `;
    });

    enumCode = enumCode.slice(0, -2) + ' };';
    switchCode += '} }';

    return `[${enumCode} ${switchCode}]`;
  };

  const copiarAlPortapapeles = () => {
    const comandosPixel = pixeles.map((colorPixel, indice) => {
      if (colorPixel) {
        const { x, y } = calcularCoordenadas(indice);
        const aliasActual = Object.keys(coloresGuardados).find(clave => coloresGuardados[clave] === colorPixel) || 'ColorSinNombre';
        return `dibujarPixel(${x},${y},${aliasActual});`;
      }
      return null;
    }).filter(Boolean);

    const enumColorCode = generarEnumColor();
    const textoPortapapeles = `${enumColorCode}\n[${comandosPixel.join('\n\t\t')}]`;
    
    navigator.clipboard.writeText(textoPortapapeles)
      .then(() => alert('¡Copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar: ', err));
  };

  useEffect(() => {
    if (imagenFondo && refLienzo.current) {
      const lienzo = refLienzo.current;
      const ctx = lienzo.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, lienzo.width, lienzo.height);
        const anchoEscalado = img.width * escalaFondo;
        const altoEscalado = img.height * escalaFondo;
        const x = (lienzo.width - anchoEscalado) / 2 + posicionFondo.x;
        const y = (lienzo.height - altoEscalado) / 2 + posicionFondo.y;
        ctx.drawImage(img, x, y, anchoEscalado, altoEscalado);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, lienzo.width, lienzo.height);
        ctx.globalAlpha = 1.0;
      };
      img.src = imagenFondo;
    }
  }, [imagenFondo, anchoLienzo, altoLienzo, posicionFondo, escalaFondo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}
         onContextMenu={(e) => e.preventDefault()}>
      <div>
        <input
          type="number"
          value={anchoLienzo}
          onChange={(e) => setAnchoLienzo(parseInt(e.target.value))}
          placeholder="Ancho"
          style={{ width: '60px', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          value={altoLienzo}
          onChange={(e) => setAltoLienzo(parseInt(e.target.value))}
          placeholder="Alto"
          style={{ width: '60px' }}
        />
      </div>
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => manejarCambioColor(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Alias del color"
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={guardarColor}>Guardar color</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {Object.entries(coloresGuardados).map(([alias, colorGuardado]) => (
          <button
            key={alias}
            onClick={() => aplicarColorGuardado(alias)}
            style={{
              margin: '0.2rem',
              padding: '0.5rem',
              backgroundColor: colorGuardado,
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {alias}
          </button>
        ))}
      </div>
      <input type="file" onChange={manejarSubidaImagen} accept="image/*" />
      {imagenFondo && (
        <div>
          <div>
            <button onClick={() => moverFondo(0, -1)}>↑</button>
            <button onClick={() => moverFondo(0, 1)}>↓</button>
            <button onClick={() => moverFondo(-1, 0)}>←</button>
            <button onClick={() => moverFondo(1, 0)}>→</button>
          </div>
          <div>
            <input
              type="number"
              value={posicionFondo.x}
              onChange={(e) => setPosicionFondo(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
              placeholder="X"
              style={{ width: '50px', marginRight: '0.5rem' }}
            />
            <input
              type="number"
              value={posicionFondo.y}
              onChange={(e) => setPosicionFondo(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
              placeholder="Y"
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <button onClick={() => escalarFondo(0.1)}>Zoom +</button>
            <button onClick={() => escalarFondo(-0.1)}>Zoom -</button>
            <input
              type="number"
              value={escalaFondo}
              onChange={(e) => setEscalaFondo(parseFloat(e.target.value) || 1)}
              step="0.1"
              style={{ width: '50px' }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${anchoLienzo}, 1fr)`,
          gap: '1px',
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        <canvas
          ref={refLienzo}
          width={anchoLienzo * 20}
          height={altoLienzo * 20}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
        {pixeles.map((colorPixel, indice) => (
          <div
            key={indice}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: colorPixel || 'transparent',
              border: '1px solid #e0e0e0',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseDown={(e) => manejarClicPixel(indice, e)}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))}
      </div>
      <button onClick={copiarAlPortapapeles}>Copiar al portapapeles</button>
    </div>
  );
};

export default EditorArtePixelado;