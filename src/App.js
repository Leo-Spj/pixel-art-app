import React, { useEffect } from 'react';
import EditorArtePixelado from './EditorArtePixelado';

function App() {
  useEffect(() => {
    const esDispositivoMovil = () => {
      return /Mobi|Android/i.test(navigator.userAgent);
    };

    const bloquearAccesoMovil = () => {
      if (esDispositivoMovil()) {
        alert('Esta página no es soportada en dispositivos móviles. Por favor, accede desde un navegador en un dispositivo de escritorio.');
      }
    };

    bloquearAccesoMovil();
  }, []);

  return (
    <div className="App">
      <EditorArtePixelado />
    </div>
  );
}

export default App;