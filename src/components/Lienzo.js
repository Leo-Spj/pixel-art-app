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
  const refCruz = useRef(null);

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
          ctx.globalAlpha = 0.5; // Ajusta la opacidad de la imagen de fondo
          ctx.drawImage(img, x, y, anchoEscalado, altoEscalado);
          ctx.globalAlpha = 1.0; // Restablece la opacidad a 1.0 para otros elementos
        };
        img.src = imagenFondo;
      }
    }
  }, [imagenFondo, anchoLienzo, altoLienzo, posicionFondo, escalaFondo, mostrarFondo]);

  useEffect(() => {
    if (refCruz.current) {
      const cruz = refCruz.current;
      const ctx = cruz.getContext('2d');
      ctx.clearRect(0, 0, cruz.width, cruz.height);
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 0.6;
      const midX = cruz.width / 2;
      const midY = (cruz.height / 2) + tamanoCelda;
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, cruz.height);
      ctx.moveTo(0, midY);
      ctx.lineTo(cruz.width, midY);
      ctx.stroke();
    }
  }, [anchoLienzo, altoLienzo, tamanoCelda]);

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
      <canvas
        ref={refCruz}
        width={anchoLienzo * tamanoCelda}
        height={altoLienzo * tamanoCelda}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Ensure it doesn't interfere with mouse events
          zIndex: 2, // Ensure it is above other elements
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