import { useState } from 'react'
import TarjetaResumen from '../components/TarjetaResumen'
import EtiquetaEstado from '../components/EtiquetaEstado'

export default function Cheques({ cheques, cargando, error }) {
  // Estados para la interactividad de la pantalla
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroBanco, setFiltroBanco] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados para el formulario de nuevo cheque
  const [nuevoNumero, setNuevoNumero] = useState('');
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [nuevoBanco, setNuevoBanco] = useState('Nación');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  // Lista local para poder agregar cheques dinámicamente
  const [listaCheques, setListaCheques] = useState(cheques);

  // Sincronizamos por si vienen nuevos datos de afuera
  if (cheques.length !== listaCheques.length && listaCheques.length === 0) {
    setListaCheques(cheques);
  }

  // Filtrado avanzado (Buscador + Selects)
  const chequesFiltrados = listaCheques.filter(cheque => {
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = 
      cheque.numero.toLowerCase().includes(textoBusqueda) ||
      cheque.proveedor.toLowerCase().includes(textoBusqueda) ||
      cheque.banco.toLowerCase().includes(textoBusqueda);

    const coincideEstado = filtroEstado === 'Todos' || cheque.estado === filtroEstado;
    const coincideBanco = filtroBanco === 'Todos' || cheque.banco === filtroBanco;

    return coincideTexto && coincideEstado && coincideBanco;
  });

  // Cálculos matemáticos basados en los filtrados o totales
  const totalCheques = listaCheques.length;
  const totalProximos = listaCheques.filter(c => c.estado === 'Próximo a vencer').length;
  const totalPendientes = listaCheques.filter(c => c.estado === 'Pendiente').length;
  const montoTotal = listaCheques.reduce((acum, c) => acum + c.monto, 0);

  // Función para manejar el envío del formulario de nuevo cheque
  const agregarCheque = (e) => {
    e.preventDefault();
    if (!nuevoNumero || !nuevoProveedor || !nuevoMonto || !nuevaFecha) return;

    // Cálculo rápido de estado para el nuevo cheque
    const hoy = new Date();
    const fechaPago = new Date(nuevaFecha + "T00:00:00");
    const diferenciaDias = Math.ceil((fechaPago.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    
    let estadoCalculado = 'Pendiente';
    if (diferenciaDias < 0) estadoCalculado = 'Vencido';
    else if (diferenciaDias <= 5) estadoCalculado = 'Próximo a vencer';

    const chequeCreado = {
      id: Date.now(),
      numero: nuevoNumero,
      proveedor: nuevoProveedor,
      banco: nuevoBanco,
      monto: Number(nuevoMonto),
      fechaPago: nuevaFecha,
      estado: estadoCalculado
    };

    setListaCheques([chequeCreado, ...listaCheques]);
    setModalAbierto(false);
    
    // Limpiar formulario
    setNuevoNumero('');
    setNuevoProveedor('');
    setNuevoMonto('');
    setNuevaFecha('');
  };

  return (
    <main className="contenido-principal">
      {/* 1. ENCABEZADO CON BOTONES FUNCIONALES */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
              <h2 className="titulo-mono">Cheques</h2>
              <p style={{ color: 'var(--texto-secundario)', marginTop: '5px' }}>Gestión y seguimiento de cheques</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => alert("¡Función de exportar CSV simulada con éxito!")}
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid var(--borde-suave)', borderRadius: '4px', cursor: 'pointer' }}
              >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Exportar
              </button>
              <button 
                onClick={() => setModalAbierto(true)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                  + Nuevo Cheque
              </button>
          </div>
      </header>

      {/* 2. TARJETAS DE RESUMEN */}
      <section className="contenedor-tarjetas" style={{ marginTop: '2rem' }}>
          <TarjetaResumen titulo="Total cheques" numero={totalCheques} colorBorde="borde-gris" />
          <TarjetaResumen titulo="Próx. a vencer" numero={totalProximos} colorBorde="borde-rojo" />
          <TarjetaResumen titulo="Pendientes" numero={totalPendientes} colorBorde="borde-naranja" />
          <TarjetaResumen titulo="Monto total" numero={`$${montoTotal.toLocaleString('es-AR')}`} colorBorde="borde-verde" />
      </section>

      {/* 3. BARRA DE FILTROS INTERACTIVA */}
      <section style={{ marginTop: '2rem', display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'white', border: '1px solid var(--borde-suave)', borderRadius: '8px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px' }}>
              <span style={{ marginRight: '10px' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar por Nº, proveedor o banco..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%' }} 
              />
          </div>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '0.5rem 2rem 0.5rem 1rem', border: '1px solid var(--borde-suave)', borderRadius: '4px', backgroundColor: 'white' }}
          >
              <option value="Todos">Estado: Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Próximo a vencer">Próximo a vencer</option>
              <option value="Vencido">Vencido</option>
          </select>
          <select 
            value={filtroBanco} 
            onChange={(e) => setFiltroBanco(e.target.value)}
            style={{ padding: '0.5rem 2rem 0.5rem 1rem', border: '1px solid var(--borde-suave)', borderRadius: '4px', backgroundColor: 'white' }}
          >
              <option value="Todos">Banco: Todos</option>
              <option value="Nación">Nación</option>
              <option value="Galicia">Galicia</option>
              <option value="Santander">Santander</option>
          </select>
      </section>

      {/* 4. TABLA PRINCIPAL */}
      <section style={{ marginTop: '1rem', backgroundColor: 'white', border: '1px solid var(--borde-suave)', borderRadius: '8px', overflow: 'hidden' }}>
          {cargando && <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando base de datos...</p>}
          {error && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-rojo)' }}>{error}</p>}
          
          {!cargando && !error && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--borde-suave)' }}>
                  <th style={{ padding: '1rem' }}>Nº Cheque</th>
                  <th>Proveedor</th>
                  <th>Banco</th>
                  <th>Fecha de pago</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Días Restantes</th>
                </tr>
              </thead>
              <tbody>
                {chequesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--texto-secundario)' }}>
                      No se encontraron cheques con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  chequesFiltrados.map(cheque => {
                    const hoy = new Date();
                    const fechaPago = new Date(cheque.fechaPago + "T00:00:00");
                    const dias = Math.ceil((fechaPago.getTime() - hoy.getTime()) / (1000 * 3600 * 24));

                    return (
                      <tr key={cheque.id} style={{ borderBottom: '1px solid var(--borde-suave)' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{cheque.numero}</td>
                        <td>{cheque.proveedor}</td>
                        <td>{cheque.banco}</td>
                        <td>{cheque.fechaPago}</td>
                        <td>$ {cheque.monto.toLocaleString('es-AR')}</td>
                        <td>
                          <EtiquetaEstado estado={cheque.estado} />
                        </td>
                        <td>{dias < 0 ? 'Vencido' : `${dias} días`}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
      </section>

      {/* VENTANA MODAL PARA NUEVO CHEQUE */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Registrar Nuevo Cheque</h3>
            <form onSubmit={agregarCheque} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nº de Cheque</label>
                <input type="text" placeholder="Ej: 45678912" value={nuevoNumero} onChange={e => setNuevoNumero(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Proveedor</label>
                <input type="text" placeholder="Ej: Semillas SA" value={nuevoProveedor} onChange={e => setNuevoProveedor(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Banco</label>
                <select value={nuevoBanco} onChange={e => setNuevoBanco(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px', backgroundColor: 'white' }}>
                  <option value="Nación">Nación</option>
                  <option value="Galicia">Galicia</option>
                  <option value="Santander">Santander</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Monto ($)</label>
                <input type="number" placeholder="Ej: 1500000" value={nuevoMonto} onChange={e => setNuevoMonto(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Fecha de Pago</label>
                <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--borde-suave)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}