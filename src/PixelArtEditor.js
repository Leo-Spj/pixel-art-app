import React, { useState, useRef, useEffect } from 'react';

const PixelArtEditor = () => {
  const [canvasWidth, setCanvasWidth] = useState(16);
  const [canvasHeight, setCanvasHeight] = useState(16);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [pixels, setPixels] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [backgroundScale, setBackgroundScale] = useState(1);
  const [savedColors, setSavedColors] = useState({});
  const [alias, setAlias] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    setPixels(Array(canvasWidth * canvasHeight).fill(''));
  }, [canvasWidth, canvasHeight]);

  const calculateCoordinates = (index) => {
    const x = index % canvasWidth - Math.floor(canvasWidth / 2);
    const y = Math.floor(canvasHeight / 2) - Math.floor(index / canvasWidth);
    return { x, y };
  };

  const handlePixelClick = (index, event) => {
    event.preventDefault(); // Prevent default right-click menu
    if (event.button === 0) { // Left click
      const currentAlias = Object.keys(savedColors).find(key => 
        savedColors[key].r === color.r && 
        savedColors[key].g === color.g && 
        savedColors[key].b === color.b
      ) || 'UnnamedColor';

      setPixels(prevPixels => {
        const newPixels = [...prevPixels];
        newPixels[index] = `rgb(${color.r}, ${color.g}, ${color.b})`;
        return newPixels;
      });
    } else if (event.button === 2) { // Right click
      setPixels(prevPixels => {
        const newPixels = [...prevPixels];
        newPixels[index] = '';
        return newPixels;
      });
    }
  };

  const handleColorChange = (component, value) => {
    setColor(prevColor => ({ ...prevColor, [component]: parseInt(value) || 0 }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target.result);
      setBackgroundPosition({ x: 0, y: 0 });
      setBackgroundScale(1);
    };
    reader.readAsDataURL(file);
  };

  const moveBackground = (dx, dy) => {
    setBackgroundPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const scaleBackground = (delta) => {
    setBackgroundScale(prev => Math.max(0.1, Math.min(5, prev + delta)));
  };

  const saveColor = () => {
    if (alias) {
      setSavedColors(prevSavedColors => ({
        ...prevSavedColors,
        [alias]: { ...color }
      }));
      setAlias('');
    }
  };

  const applySavedColor = (alias) => {
    if (savedColors[alias]) {
      setColor(savedColors[alias]);
    }
  };

  const copyToClipboard = () => {
    const pixelCommands = pixels.map((pixelColor, index) => {
      if (pixelColor) {
        const { x, y } = calculateCoordinates(index);
        const currentAlias = Object.keys(savedColors).find(key => 
          `rgb(${savedColors[key].r}, ${savedColors[key].g}, ${savedColors[key].b})` === pixelColor
        ) || 'UnnamedColor';
        return `drawPixel(${x},${y},${currentAlias});`;
      }
      return null;
    }).filter(Boolean);

    const clipboardText = pixelCommands.join('\n\t\t');
    navigator.clipboard.writeText(`[${clipboardText}]`)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  useEffect(() => {
    if (backgroundImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scaledWidth = img.width * backgroundScale;
        const scaledHeight = img.height * backgroundScale;
        const x = (canvas.width - scaledWidth) / 2 + backgroundPosition.x;
        const y = (canvas.height - scaledHeight) / 2 + backgroundPosition.y;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage, canvasWidth, canvasHeight, backgroundPosition, backgroundScale]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}
         onContextMenu={(e) => e.preventDefault()}>
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
      <div>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Alias del color"
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={saveColor}>Guardar color</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {Object.keys(savedColors).map((alias) => (
          <button
            key={alias}
            onClick={() => applySavedColor(alias)}
            style={{
              margin: '0.2rem',
              padding: '0.5rem',
              backgroundColor: `rgb(${savedColors[alias].r}, ${savedColors[alias].g}, ${savedColors[alias].b})`,
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {alias}
          </button>
        ))}
      </div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {backgroundImage && (
        <div>
          <div>
            <button onClick={() => moveBackground(0, -1)}>↑</button>
            <button onClick={() => moveBackground(0, 1)}>↓</button>
            <button onClick={() => moveBackground(-1, 0)}>←</button>
            <button onClick={() => moveBackground(1, 0)}>→</button>
          </div>
          <div>
            <input
              type="number"
              value={backgroundPosition.x}
              onChange={(e) => setBackgroundPosition(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
              placeholder="X"
              style={{ width: '50px', marginRight: '0.5rem' }}
            />
            <input
              type="number"
              value={backgroundPosition.y}
              onChange={(e) => setBackgroundPosition(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
              placeholder="Y"
              style={{ width: '50px' }}
            />
          </div>
          <div>
            <button onClick={() => scaleBackground(0.1)}>Zoom +</button>
            <button onClick={() => scaleBackground(-0.1)}>Zoom -</button>
            <input
              type="number"
              value={backgroundScale}
              onChange={(e) => setBackgroundScale(parseFloat(e.target.value) || 1)}
              step="0.1"
              style={{ width: '50px' }}
            />
          </div>
        </div>
      )}
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
            onMouseDown={(e) => handlePixelClick(index, e)}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))}
      </div>
      <button onClick={copyToClipboard}>Copiar al portapapeles</button>
    </div>
  );
};

export default PixelArtEditor;