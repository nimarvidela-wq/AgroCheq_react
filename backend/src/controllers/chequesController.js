import { readFile, writeFile } from 'node:fs/promises';

const RUTA_DATOS = new URL('../../data/cheques.json', import.meta.url);

async function leerCheques() {
  const contenido = await readFile(RUTA_DATOS, 'utf-8');
  return JSON.parse(contenido);
}

async function guardarCheques(cheques) {
  await writeFile(RUTA_DATOS, JSON.stringify(cheques, null, 2), 'utf-8');
}

export async function obtenerCheques(req, res, next) {
  try {
    let cheques = await leerCheques();
    const { banco, buscar } = req.query;

    if (banco) {
      cheques = cheques.filter(
        (c) => c.banco.toLowerCase() === banco.toLowerCase()
      );
    }

    if (buscar) {
      const termino = buscar.toLowerCase();
      cheques = cheques.filter(
        (c) =>
          c.proveedor.toLowerCase().includes(termino) ||
          c.numero.toLowerCase().includes(termino)
      );
    }

    res.status(200).json(cheques);
  } catch (error) {
    next(error);
  }
}

export async function obtenerChequePorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    const cheques = await leerCheques();
    const cheque = cheques.find((c) => c.id === id);

    if (!cheque) {
      return res.status(404).json({ error: 'Cheque no encontrado' });
    }

    res.status(200).json(cheque);
  } catch (error) {
    next(error);
  }
}

export async function crearCheque(req, res, next) {
  try {
    const { numero, proveedor, banco, monto, fechaPago } = req.body;

    if (
      !numero ||
      !proveedor ||
      !banco ||
      !fechaPago ||
      typeof monto !== 'number' ||
      monto <= 0
    ) {
      return res.status(400).json({
        error:
          'Datos inválidos. Se requiere numero, proveedor, banco, fechaPago y un monto numérico mayor a 0.'
      });
    }

    const cheques = await leerCheques();
    const nuevoId =
      cheques.length > 0 ? Math.max(...cheques.map((c) => c.id)) + 1 : 1;

    const nuevoCheque = {
      id: nuevoId,
      numero: String(numero),
      proveedor: String(proveedor),
      banco: String(banco),
      monto,
      fechaPago: String(fechaPago)
    };

    cheques.push(nuevoCheque);
    await guardarCheques(cheques);

    res.status(201).json(nuevoCheque);
  } catch (error) {
    next(error);
  }
}

export async function actualizarCheque(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { numero, proveedor, banco, monto, fechaPago } = req.body || {};

    if (
      !numero ||
      !proveedor ||
      !banco ||
      !fechaPago ||
      typeof monto !== 'number' ||
      monto <= 0
    ) {
      return res.status(400).json({
        error: 'Datos inválidos para actualizar el cheque.'
      });
    }

    const cheques = await leerCheques();
    const indice = cheques.findIndex((c) => c.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Cheque no encontrado' });
    }

    cheques[indice] = {
      id,
      numero: String(numero),
      proveedor: String(proveedor),
      banco: String(banco),
      monto,
      fechaPago: String(fechaPago)
    };

    await guardarCheques(cheques);
    res.status(200).json(cheques[indice]);
  } catch (error) {
    next(error);
  }
}

export async function eliminarCheque(req, res, next) {
  try {
    const id = Number(req.params.id);
    const cheques = await leerCheques();
    const existe = cheques.some((c) => c.id === id);

    if (!existe) {
      return res.status(404).json({ error: 'Cheque no encontrado' });
    }

    const actualizados = cheques.filter((c) => c.id !== id);
    await guardarCheques(actualizados);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}