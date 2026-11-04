export default function TarjetaResumen({ titulo, numero, colorBorde }) {
  return (
    <article className={`tarjeta-resumen ${colorBorde}`}>
        <h3>{numero}</h3>
        <p>{titulo}</p>
    </article>
  )
}