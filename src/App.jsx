import Cheques from './pages/Cheques' 
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Inicio from './pages/Inicio'

const calcularEstadoCheque = (fechaString) => {
  const hoy = new Date();
  const fechaPago = new Date(fechaString + "T00:00:00");
  const diferenciaTiempo = fechaPago.getTime() - hoy.getTime();
  const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

  if (diferenciaDias < 0) return 'Vencido';
  if (diferenciaDias >= 0 && diferenciaDias <= 5) return 'Próximo a vencer';
  return 'Pendiente';
};

function App() {
  // ESTADO NUEVO: Controla en qué pantalla estamos
  const [pantallaActual, setPantallaActual] = useState('inicio');
  
  const [cheques, setCheques] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/cheques.json')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error('Error al cargar los cheques')
        return respuesta.json()
      })
      .then(datosCrudos => {
        const datosProcesados = datosCrudos.map(cheque => ({
          ...cheque,
          estado: calcularEstadoCheque(cheque.fechaPago)
        }));
        setCheques(datosProcesados);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      })
  }, [])

  return (
    <div className="contenedor-app">
      {/* Le pasamos la función a la Sidebar para que los botones puedan cambiar la pantalla */}
      <Sidebar pantallaActual={pantallaActual} setPantallaActual={setPantallaActual} />
      
      {/* RENDERIZADO CONDICIONAL: Si el estado es 'inicio', mostramos el componente Inicio */}
      {pantallaActual === 'inicio' && (
        <Inicio cheques={cheques} cargando={cargando} error={error} />
      )}

      {/* RENDERIZADO CONDICIONAL: Si el estado es 'cheques', mostramos un mensaje temporal */}
      {pantallaActual === 'cheques' && (
        <Cheques cheques={cheques} cargando={cargando} error={error} />
      )}
    </div>
  )
}

export default App