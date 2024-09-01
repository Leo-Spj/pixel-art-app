import React, { useEffect, useState } from 'react';
import EditorArtePixelado from './EditorArtePixelado';
import ModalAdvertencia from './ModalAdvertencia';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const esDispositivoMovil = () => {
      return /Mobi|Android/i.test(navigator.userAgent);
    };

    const bloquearAccesoMovil = () => {
      if (esDispositivoMovil()) {
        setIsModalOpen(true);
      }
    };

    bloquearAccesoMovil();
  }, []);

  return (
    <div className="App">
      <EditorArtePixelado />
      <ModalAdvertencia isOpen={isModalOpen} />
    </div>
  );
}

export default App;