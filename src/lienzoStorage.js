export const guardarLienzo = (nombre, coloresGuardados, pixeles, anchoLienzo, altoLienzo, tamanoCelda, imagenFondo, posicionFondo, escalaFondo, mostrarFondo) => {
  const lienzo = {
    nombre,
    coloresGuardados,
    pixeles,
    anchoLienzo,
    altoLienzo,
    tamanoCelda,
    imagenFondo,
    posicionFondo,
    escalaFondo,
    mostrarFondo,
  };
  const lienzosGuardados = JSON.parse(localStorage.getItem('lienzosGuardados')) || [];
  lienzosGuardados.push(lienzo);
  localStorage.setItem('lienzosGuardados', JSON.stringify(lienzosGuardados));
  alert('Lienzo guardado exitosamente.');
};

export const cargarLienzo = (nombre, setColoresGuardados, setPixeles, setAnchoLienzo, setAltoLienzo, setTamanoCelda, setImagenFondo, setPosicionFondo, setEscalaFondo, setMostrarFondo, anchoLienzoActual, altoLienzoActual) => {
  const lienzosGuardados = JSON.parse(localStorage.getItem('lienzosGuardados')) || [];
  const lienzo = lienzosGuardados.find(l => l.nombre === nombre);
  if (lienzo) {
    setColoresGuardados(lienzo.coloresGuardados);
    
    // Ajustar las dimensiones del lienzo
    setAnchoLienzo(lienzo.anchoLienzo);
    setAltoLienzo(lienzo.altoLienzo);

    // Ajustar los píxeles a las nuevas dimensiones
    const nuevosPixeles = Array(lienzo.anchoLienzo * lienzo.altoLienzo).fill('');
    for (let y = 0; y < Math.min(lienzo.altoLienzo, altoLienzoActual); y++) {
      for (let x = 0; x < Math.min(lienzo.anchoLienzo, anchoLienzoActual); x++) {
        nuevosPixeles[y * lienzo.anchoLienzo + x] = lienzo.pixeles[y * lienzo.anchoLienzo + x];
      }
    }
    setPixeles(nuevosPixeles);

    setTamanoCelda(lienzo.tamanoCelda);
    setImagenFondo(lienzo.imagenFondo);
    setPosicionFondo(lienzo.posicionFondo);
    setEscalaFondo(lienzo.escalaFondo);
    setMostrarFondo(lienzo.mostrarFondo);
    alert('Lienzo cargado exitosamente.');
  } else {
    alert('Lienzo no encontrado.');
  }
};

export const eliminarLienzo = (nombre) => {
  let lienzosGuardados = JSON.parse(localStorage.getItem('lienzosGuardados')) || [];
  lienzosGuardados = lienzosGuardados.filter(l => l.nombre !== nombre);
  localStorage.setItem('lienzosGuardados', JSON.stringify(lienzosGuardados));
  alert('Lienzo eliminado exitosamente.');
};

export const obtenerLienzos = () => {
  return JSON.parse(localStorage.getItem('lienzosGuardados')) || [];
};