import { Router, Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import crypto from "crypto";
import connection from "../database/connection";
import { calcularImporte } from "../utils/calcularImporte";

// Máximo de copias que un alumno puede pedir por documento
const MAX_COPIAS = 3;

interface DocumentoCosto extends RowDataPacket {
  id: number;
  costo: number;
}

interface NuevaSolicitud {
  estudiante_id: number; // temporal: más adelante saldrá del token del login
  documento_id: number;
  copias: number;
}

const router = Router();

function parteAleatoria(): string {
  return crypto.randomBytes(2).toString("hex").toUpperCase();
}

// POST /api/solicitudes -> crea la solicitud, su ficha de pago y la línea de tiempo
router.post("/", async (req: Request, res: Response) => {
  const { estudiante_id, documento_id, copias } = (req.body ?? {}) as Partial<NuevaSolicitud>;

  if (
    !Number.isInteger(estudiante_id) ||
    !Number.isInteger(documento_id) ||
    !Number.isInteger(copias) ||
    (copias as number) < 1
  ) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  if ((copias as number) > MAX_COPIAS) {
    res.status(400).json({ error: `Máximo ${MAX_COPIAS} copias por documento` });
    return;
  }

  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    const [estudiantes] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM estudiantes WHERE id = ?",
      [estudiante_id]
    );
    if (estudiantes.length === 0) {
      await conn.rollback();
      res.status(404).json({ error: "Estudiante no encontrado" });
      return;
    }

    const [docs] = await conn.query<DocumentoCosto[]>(
      "SELECT id, costo FROM documentos WHERE id = ? AND disponible = 1",
      [documento_id]
    );
    if (docs.length === 0) {
      await conn.rollback();
      res.status(404).json({ error: "Documento no encontrado" });
      return;
    }

    const costo = Number(docs[0].costo);
    const importe = calcularImporte(costo, copias as number);

    // 1) Solicitud con folio temporal (el folio real necesita el id)
    const [r] = await conn.query<ResultSetHeader>(
      `INSERT INTO solicitudes
       (folio, estudiante_id, documento_id, copias, costo_documento, importe_total, estatus_id)
       VALUES (?, ?, ?, ?, ?, ?, 2)`,
      [`TMP-${Date.now()}`, estudiante_id, documento_id, copias, costo, importe]
    );
    const id = r.insertId;
    const folio = `REQ-${new Date().getFullYear()}-${String(id).padStart(3, "0")}`;
    await conn.query("UPDATE solicitudes SET folio = ? WHERE id = ?", [folio, id]);

    // 2) Ficha de pago: referencia aleatoria y 5 días para pagar
    const referencia = `PAY-${parteAleatoria()}-${parteAleatoria()}`;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 5);
    const limite = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    await conn.query(
      "INSERT INTO fichas_pago (solicitud_id, referencia, monto, fecha_limite) VALUES (?, ?, ?, ?)",
      [id, referencia, importe, limite]
    );

    // 3) Línea de tiempo: "Solicitud enviada" y "Ficha generada"
    await conn.query(
      "INSERT INTO seguimiento (solicitud_id, estatus_id) VALUES (?, 1), (?, 2)",
      [id, id]
    );

    await conn.commit();
    res.status(201).json({ folio, referencia, monto: importe, fecha_limite: limite });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    conn.release();
  }
});

export default router;
