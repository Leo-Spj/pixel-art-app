import React from 'react';

const SubidorImagen = ({ setImagenFondo }) => {
  const manejarSubidaImagen = (e) => {
    const archivo = e.target.files[0];
    const lector = new FileReader();
    lector.onload = (evento) => {
      setImagenFondo(evento.target.result);
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <input
      type="file"
      onChange={manejarSubidaImagen}
      accept="image/*"
      style={{ marginBottom: '1rem' }}
    />
  );
};

export default SubidorImagen;