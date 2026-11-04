import EtiquetaEstado from '../components/EtiquetaEstado'
import TarjetaResumen from '../components/TarjetaResumen'

export default function Inicio({ cheques, cargando, error }) {
  // Cálculos matemáticos corregidos
  const totalVencidos = cheques.filter(c => c.estado === 'Vencido').length;
  const totalProximos = cheques.filter(c => c.estado === 'Próximo a vencer').length;
  const totalPendientes = cheques.filter(c => c.estado === 'Pendiente').length; 

  return (
    <main className="contenido-principal">
      <header>
          <div>
              <h2 className="titulo-mono">Inicio</h2>
              <p style={{ color: 'var(--texto-secundario)', marginTop: '5px' }}>Resumen general de tu cartera</p>
          </div>
      </header>

      <section className="contenedor-tarjetas">
          <TarjetaResumen titulo="Vencidos" numero={totalVencidos} colorBorde="borde-rojo" />
          <TarjetaResumen titulo="Próximos a vencer" numero={totalProximos} colorBorde="borde-naranja" />
          <TarjetaResumen titulo="Pendientes (Al día)" numero={totalPendientes} colorBorde="borde-verde" />
          <TarjetaResumen titulo="Cobrados este mes" numero="0" colorBorde="borde-azul" />
      </section>

      <section style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Cheques Recientes</h3>
          {cargando && <p>Cargando datos de la cartera...</p>}
          {error && <p style={{ color: 'var(--color-rojo)' }}>{error}</p>}
          
          {!cargando && !error && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--borde-suave)' }}>
                  <th>Número</th>
                  <th>Proveedor</th>
                  <th>Banco</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cheques.map(cheque => (
                  <tr key={cheque.id} style={{ borderBottom: '1px solid var(--borde-suave)' }}>
                    <td style={{ padding: '0.8rem 0' }}>{cheque.numero}</td>
                    <td>{cheque.proveedor}</td>
                    <td>{cheque.banco}</td>
                    <td>$ {cheque.monto.toLocaleString('es-AR')}</td>
                    <td>
                      <span className={`etiqueta ${cheque.estado === 'Vencido' ? 'rojo' : cheque.estado === 'Pendiente' ? 'verde' : 'naranja'}`}>
                        {cheque.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </section>
    </main>
  )
}