import React from 'react';

const CargarArchivo = ({ etiqueta, aceptar, manejarCarga }) => (
  <div>
    <label>{etiqueta}</label>
    <input type="file" onChange={manejarCarga} accept={aceptar} />
  </div>
);

export default CargarArchivo;