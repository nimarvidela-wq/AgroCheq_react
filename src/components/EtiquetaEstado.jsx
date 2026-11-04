export default function EtiquetaEstado({ estado }) {
  // Determinamos el color en base al texto del estado
  let colorClase = 'naranja'; // Por defecto (Próximo a vencer)
  
  if (estado === 'Vencido') {
    colorClase = 'rojo';
  } else if (estado === 'Pendiente') {
    colorClase = 'verde';
  }

  return (
    <span className={`etiqueta ${colorClase}`}>
      {estado}
    </span>
  )
}