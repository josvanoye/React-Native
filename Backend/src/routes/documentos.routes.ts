import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import connection from "../database/connection";

interface Documento extends RowDataPacket {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  dias_estimados: number;
  formato: string;
  vigencia_dias: number | null;
  icono: string | null;
}

const COLUMNAS =
  "id, nombre, descripcion, costo, dias_estimados, formato, vigencia_dias, icono";

const router = Router();

// GET /api/documentos -> catálogo completo (pantalla "Solicitar documento")
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [filas] = await connection.query<Documento[]>(
      `SELECT ${COLUMNAS} FROM documentos WHERE disponible = 1 ORDER BY id`
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar el catálogo" });
  }
});

// GET /api/documentos/:id -> un documento (pantalla de detalle)
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Id inválido" });
    return;
  }

  try {
    const [filas] = await connection.query<Documento[]>(
      `SELECT ${COLUMNAS} FROM documentos WHERE id = ? AND disponible = 1`,
      [id]
    );
    if (filas.length === 0) {
      res.status(404).json({ error: "Documento no encontrado" });
      return;
    }
    res.json(filas[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar el documento" });
  }
});

export default router;
