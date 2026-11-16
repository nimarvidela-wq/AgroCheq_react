import express from 'express';
import cors from 'cors';
import chequesRoutes from './routes/chequesRoutes.js';
import {
  registrarPeticion,
  rutaNoEncontrada,
  manejarErrores
} from './middlewares/middlewares.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(registrarPeticion);

app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/cheques', chequesRoutes);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});