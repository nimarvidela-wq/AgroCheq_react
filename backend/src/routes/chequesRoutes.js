import { Router } from 'express';
import {
  obtenerCheques,
  obtenerChequePorId,
  crearCheque,
  actualizarCheque,
  eliminarCheque
} from '../controllers/chequesController.js';

const router = Router();

router.get('/', obtenerCheques);
router.get('/:id', obtenerChequePorId);
router.post('/', crearCheque);
router.put('/:id', actualizarCheque);
router.delete('/:id', eliminarCheque);

export default router;