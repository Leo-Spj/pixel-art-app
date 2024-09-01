import React, { useState, useRef, useEffect } from 'react';

const EditorArtePixelado = () => {
  const [anchoLienzo, setAnchoLienzo] = useState(23);
  const [altoLienzo, setAltoLienzo] = useState(16);
  const [color, setColor] = useState('#000000');
  const [pixeles, setPixeles] = useState([]);
  const [imagenFondo, setImagenFondo] = useState(null);
  const [posicionFondo, setPosicionFondo] = useState({ x: 0, y: 0 });
  const [escalaFondo, setEscalaFondo] = useState(1);
  const [coloresGuardados, setColoresGuardados] = useState({});
  const [alias, setAlias] = useState('');
  const [mostrarFondo, setMostrarFondo] = useState(true);
  const [tamanoCelda, setTamanoCelda] = useState(20); // Nuevo estado para el tamaño de las celdas
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
    if (!Object.values(coloresGuardados).includes(color)) {
      alert('Por favor, guarda el color con un alias antes de pintar.');
      return;
    }
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

  const eliminarColorGuardado = (alias) => {
    setColoresGuardados(anteriores => {
      const nuevosColores = { ...anteriores };
      delete nuevosColores[alias];
      return nuevosColores;
    });
  };

  const aplicarColorGuardado = (alias) => {
    if (coloresGuardados[alias]) {
      setColor(coloresGuardados[alias]);
    }
  };

  const generarCodigoCompleto = () => {
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
        const { x, y } = calcularCoordenadas(indice);
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

  const copiarAlPortapapeles = () => {
    const codigoCompleto = generarCodigoCompleto();
    navigator.clipboard.writeText(codigoCompleto)
      .then(() => alert('¡Copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar: ', err));
  };

  useEffect(() => {
    if (refLienzo.current) {
      const lienzo = refLienzo.current;
      const ctx = lienzo.getContext('2d');
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      if (imagenFondo && mostrarFondo) {
        const img = new Image();
        img.onload = () => {
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
    }
  }, [imagenFondo, anchoLienzo, altoLienzo, posicionFondo, escalaFondo, mostrarFondo]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }} onContextMenu={(e) => e.preventDefault()}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Editor de Arte Pixelado</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="number"
          value={anchoLienzo}
          onChange={(e) => setAnchoLienzo(parseInt(e.target.value))}
          placeholder="Ancho"
          style={{ width: '60px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          value={altoLienzo}
          onChange={(e) => setAltoLienzo(parseInt(e.target.value))}
          placeholder="Alto"
          style={{ width: '60px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          value={tamanoCelda}
          onChange={(e) => setTamanoCelda(parseInt(e.target.value))}
          placeholder="Tamaño de celda"
          style={{ width: '100px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="color"
          value={color}
          onChange={(e) => manejarCambioColor(e.target.value)}
          style={{ width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '5px' }}
        />
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Alias del color"
          style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '230px'  }}
        />
        <button onClick={guardarColor} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Guardar color</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.entries(coloresGuardados).map(([alias, colorGuardado]) => (
          <div key={alias} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => aplicarColorGuardado(alias)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: colorGuardado,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {alias}
            </button>
            <button
              onClick={() => eliminarColorGuardado(alias)}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        onChange={manejarSubidaImagen}
        accept="image/*"
        style={{ marginBottom: '1rem' }}
      />
      {imagenFondo && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button onClick={() => moverFondo(0, -1)}>↑</button>
              <button onClick={() => moverFondo(0, 1)}>↓</button>
              <button onClick={() => moverFondo(-1, 0)}>←</button>
              <button onClick={() => moverFondo(1, 0)}>→</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                value={posicionFondo.x}
                onChange={(e) => setPosicionFondo(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                placeholder="X"
                style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                value={posicionFondo.y}
                onChange={(e) => setPosicionFondo(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                placeholder="Y"
                style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => escalarFondo(0.1)}>Zoom +</button>
              <button onClick={() => escalarFondo(-0.1)}>Zoom -</button>
              <input
                type="number"
                value={escalaFondo}
                onChange={(e) => setEscalaFondo(parseFloat(e.target.value) || 1)}
                step="0.1"
                style={{ width: '50px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <label htmlFor="mostrarFondo">Mostrar fondo</label>
              <input
                type="checkbox"
                id="mostrarFondo"
                checked={mostrarFondo}
                onChange={(e) => setMostrarFondo(e.target.checked)}
              />
            </div>
          </div>
          <div>
            <img src={imagenFondo} alt="Previsualización" style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
          </div>
        </div>
      )}
            <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${anchoLienzo}, 1fr)`,
          gap: '0', // Cambiado de '1px' a '0'
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          position: 'relative',
          marginBottom: '1rem'
        }}
      >
        <canvas
          ref={refLienzo}
          width={anchoLienzo * tamanoCelda}
          height={altoLienzo * tamanoCelda}
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
              width: `${tamanoCelda}px`,
              height: `${tamanoCelda}px`,
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
      <button onClick={copiarAlPortapapeles} style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>Copiar al portapapeles</button>
    </div>
  );
};

export default EditorArtePixelado;