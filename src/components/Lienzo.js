import React, { useRef, useEffect } from 'react';

const Lienzo = ({ 
  anchoLienzo, 
  altoLienzo, 
  tamanoCelda, 
  pixeles, 
  manejarClicPixel, 
  manejarMovimientoMouse, 
  manejarFinPintado,
  imagenFondo, 
  posicionFondo, 
  escalaFondo, 
  mostrarFondo 
}) => {
  const refLienzo = useRef(null);

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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${anchoLienzo}, 1fr)`,
          gap: '0',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          position: 'relative',
          marginBottom: '1rem'
        }}
        onMouseUp={manejarFinPintado}
        onMouseLeave={manejarFinPintado}
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
            onMouseEnter={() => manejarMovimientoMouse(indice)}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))}
      </div>
    );
  };
  
  export default Lienzo;
