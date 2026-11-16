export function registrarPeticion(req, res, next) {
  const hora = new Date().toLocaleTimeString();
  console.log(`[${hora}] ${req.method} ${req.originalUrl}`);
  next();
}

export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

export function manejarErrores(err, req, res, next) {
  console.error('Error en el servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
}