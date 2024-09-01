import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de que esto apunte al elemento raíz de tu aplicación

const ModalAdvertencia = ({ isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Advertencia"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000, // Asegura que el modal esté por encima de todo
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
        },
      }}
    >
      <h2>Advertencia</h2>
      <p>Esta página no es soportada en dispositivos móviles. Por favor, accede desde un navegador en un dispositivo de escritorio.</p>
    </Modal>
  );
};

export default ModalAdvertencia;