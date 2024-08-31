import React, { useState, useRef, useEffect } from 'react';

const PixelArtEditor = () => {
  const [canvasWidth, setCanvasWidth] = useState(16);
  const [canvasHeight, setCanvasHeight] = useState(16);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [pixels, setPixels] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setPixels(Array(canvasWidth * canvasHeight).fill(''));
  }, [canvasWidth, canvasHeight]);

  const handlePixelClick = (index) => {
    setPixels(prevPixels => {
      const newPixels = [...prevPixels];
      newPixels[index] = `rgb(${color.r}, ${color.g}, ${color.b})`;
      return newPixels;
    });
  };

  const handleColorChange = (component, value) => {
    setColor(prevColor => ({ ...prevColor, [component]: parseInt(value) || 0 }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (backgroundImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3; // Ajusta la opacidad aquí
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage, canvasWidth, canvasHeight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
      <div>
        <input
          type="number"
          value={canvasWidth}
          onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
          placeholder="Ancho"
          style={{ width: '60px', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          value={canvasHeight}
          onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
          placeholder="Alto"
          style={{ width: '60px' }}
        />
      </div>
      <div>
        <input
          type="number"
          value={color.r}
          onChange={(e) => handleColorChange('r', e.target.value)}
          placeholder="R"
          style={{ width: '50px', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          value={color.g}
          onChange={(e) => handleColorChange('g', e.target.value)}
          placeholder="G"
          style={{ width: '50px', marginRight: '0.5rem' }}
        />
        <input
          type="number"
          value={color.b}
          onChange={(e) => handleColorChange('b', e.target.value)}
          placeholder="B"
          style={{ width: '50px' }}
        />
      </div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${canvasWidth}, 1fr)`,
          gap: '1px',
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth * 20}
          height={canvasHeight * 20}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
        {pixels.map((pixelColor, index) => (
          <div
            key={index}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: pixelColor || 'transparent',
              border: '1px solid #e0e0e0',
              position: 'relative',
              zIndex: 1,
            }}
            onClick={() => handlePixelClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelArtEditor;