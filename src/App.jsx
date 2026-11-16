import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Inicio from './pages/Inicio'
import Cheques from './pages/Cheques'

const API_URL = import.meta.env.VITE_API_URL;

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
  const [pantallaActual, setPantallaActual] = useState('inicio');
  const [cheques, setCheques] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // GET: Cargar lista inicial desde nuestra API
  useEffect(() => {
    fetch(`${API_URL}/cheques`)
      .then(respuesta => {
        if (!respuesta.ok) throw new Error('Error al cargar los cheques desde el servidor');
        return respuesta.json();
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
      });
  }, []);

  // POST: Crear nuevo cheque en el servidor y actualizar estado global
  const crearCheque = async (datosNuevoCheque) => {
    const respuesta = await fetch(`${API_URL}/cheques`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosNuevoCheque)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.error || 'No se pudo guardar el cheque');
    }

    const chequeConEstado = {
      ...data,
      estado: calcularEstadoCheque(data.fechaPago)
    };

    setCheques(prevCheques => [chequeConEstado, ...prevCheques]);
  };

  // DELETE: Eliminar cheque en el servidor y quitarlo de la lista
  const eliminarCheque = async (id) => {
    const respuesta = await fetch(`${API_URL}/cheques/${id}`, {
      method: 'DELETE'
    });

    if (!respuesta.ok) {
      const data = await respuesta.json().catch(() => ({}));
      throw new Error(data.error || 'No se pudo eliminar el cheque');
    }

    setCheques(prevCheques => prevCheques.filter(cheque => cheque.id !== id));
  };

  return (
    <div className="contenedor-app">
      <Sidebar pantallaActual={pantallaActual} setPantallaActual={setPantallaActual} />

      {pantallaActual === 'inicio' && (
        <Inicio cheques={cheques} cargando={cargando} error={error} />
      )}

      {pantallaActual === 'cheques' && (
        <Cheques
          cheques={cheques}
          cargando={cargando}
          error={error}
          onCrearCheque={crearCheque}
          onEliminarCheque={eliminarCheque}
        />
      )}
    </div>
  )
}

export default App