import React, { useState } from 'react';

const SubidorImagen = ({ setImagenFondo }) => {
  const [nombreArchivo, setNombreArchivo] = useState('');

  const manejarSubidaImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setNombreArchivo(archivo.name);
      const lector = new FileReader();
      lector.onload = (evento) => {
        setImagenFondo(evento.target.result);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const acortarNombreArchivo = (nombre) => {
    const limite = 20;
    if (nombre.length > limite) {
      return nombre.substring(0, limite) + '...';
    }
    return nombre;
  };

  return (
    <div style={{ marginBottom: '0.5rem', marginTop: '8px', marginLeft: '0rem', display: 'flex', alignItems: 'center' }}>
      <input
        type="file"
        id="subir-imagen"
        onChange={manejarSubidaImagen}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <label 
        htmlFor="subir-imagen" 
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#6c757d',
          color: '#fff',
          borderRadius: '3px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          fontSize: '0.75rem',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
      >
        Subir Img
      </label>
      <small style={{ marginLeft: '0.25rem', color: '#6c757d', fontSize: '0.75rem' }}>
        {nombreArchivo ? acortarNombreArchivo(nombreArchivo) : ''}
      </small>
    </div>
  );
};

export default SubidorImagen;