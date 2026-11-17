// QUE HACE: los avisos del alumno. No hay tabla nueva: cada fila de "seguimiento" (un cambio de
//           estatus) ES una notificacion; el campo "leido" dice si el alumno ya la vio.
//           El texto del aviso depende del estatus al que cambio la solicitud.
import { Router, Request, Response } from "express";
// RowDataPacket = tipo de una fila que devuelve un SELECT.
import { RowDataPacket } from "mysql2";

// La misma conexion (pool) que usan solicitudes.routes.ts y admin.routes.ts.
import connection from "../database/connection";

// Forma de cada fila que leemos al listar los avisos.
interface FilaAviso extends RowDataPacket {
  id: number;            // id de la fila de seguimiento
  solicitud_id: number;
  folio: string;
  documento: string;
  estatus_id: number;
  leido: number;         // MySQL entrega 0 o 1
  fecha_cambio: Date;
}

// Forma de la fila del contador.
interface FilaContador extends RowDataPacket {
  total: number;
}

// Titulo y mensaje de cada aviso segun el estatus nuevo. El estatus 1 (Solicitud enviada)
// no genera aviso: nace junto con el 2 y seria repetir lo mismo dos veces.
const TEXTOS: Record<number, { titulo: string; mensaje: (doc: string) => string }> = {
  2: { titulo: "Ficha generada",     mensaje: (d) => `Se generó tu ficha de pago de ${d}.` },
  3: { titulo: "Pago en revisión",   mensaje: (d) => `Recibimos tu pago de ${d} y se está revisando.` },
  4: { titulo: "Pago validado",      mensaje: (d) => `Tu pago de ${d} fue validado.` },
  5: { titulo: "En preparación",     mensaje: (d) => `Tu ${d} se está preparando.` },
  6: { titulo: "Listo para recoger", mensaje: (d) => `Tu ${d} está listo. Pasa por él a Servicios Escolares.` },
  7: { titulo: "Entregado",          mensaje: (d) => `Tu ${d} fue entregado.` },
  8: { titulo: "Solicitud cancelada", mensaje: (d) => `Tu solicitud de ${d} fue cancelada.` },
  9: { titulo: "Pago rechazado",     mensaje: (d) => `Tu pago de ${d} fue rechazado. Acude a Servicios Escolares.` },
};

// Lee estudiante_id de la direccion (?estudiante_id=1). Es temporal: cuando se use el token
// de Joseline, el id saldra del token y no de la direccion.
function leerEstudiante(req: Request): number | null {
  const id = Number(req.query.estudiante_id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Grupo de rutas; server.ts lo conecta con app.use("/api/notificaciones", ...).
const router = Router();

// GET /api/notificaciones?estudiante_id=1 -> lista de avisos, del mas reciente al mas antiguo
router.get("/", async (req: Request, res: Response) => {
  const estudianteId = leerEstudiante(req);
  if (estudianteId === null) {
    res.status(400).json({ error: "Falta estudiante_id" });
    return;
  }
  try {
    const [filas] = await connection.query<FilaAviso[]>(
      `SELECT sg.id, sg.solicitud_id, s.folio, d.nombre AS documento,
              sg.estatus_id, sg.leido, sg.fecha_cambio
       FROM seguimiento sg
       JOIN solicitudes s ON s.id = sg.solicitud_id
       JOIN documentos d  ON d.id = s.documento_id
       WHERE s.estudiante_id = ? AND sg.estatus_id <> 1
       ORDER BY sg.fecha_cambio DESC, sg.id DESC`,
      [estudianteId]
    );

    // Armamos el texto de cada aviso con el estatus y el nombre del documento.
    const avisos = filas.map((f) => {
      const texto = TEXTOS[f.estatus_id];
      return {
        id: f.id,
        solicitud_id: f.solicitud_id,
        folio: f.folio,
        estatus_id: f.estatus_id,
        titulo: texto ? texto.titulo : "Estado actualizado",
        mensaje: texto ? texto.mensaje(f.documento) : `Tu solicitud de ${f.documento} cambió de estado.`,
        leido: f.leido === 1,
        fecha: f.fecha_cambio,
      };
    });
    res.json(avisos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// GET /api/notificaciones/contador?estudiante_id=1 -> cuantos avisos no se han leido
//     (el numero rojo de la pestana "Avisos")
router.get("/contador", async (req: Request, res: Response) => {
  const estudianteId = leerEstudiante(req);
  if (estudianteId === null) {
    res.status(400).json({ error: "Falta estudiante_id" });
    return;
  }
  try {
    const [filas] = await connection.query<FilaContador[]>(
      `SELECT COUNT(*) AS total
       FROM seguimiento sg
       JOIN solicitudes s ON s.id = sg.solicitud_id
       WHERE s.estudiante_id = ? AND sg.leido = 0 AND sg.estatus_id <> 1`,
      [estudianteId]
    );
    res.json({ no_leidas: Number(filas[0].total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// PATCH /api/notificaciones/leidas?estudiante_id=1 -> marca TODOS los avisos como leidos
//       (el boton "Marcar leidas")
router.patch("/leidas", async (req: Request, res: Response) => {
  const estudianteId = leerEstudiante(req);
  if (estudianteId === null) {
    res.status(400).json({ error: "Falta estudiante_id" });
    return;
  }
  try {
    // UPDATE con JOIN: solo toca las filas de seguimiento de las solicitudes de ESTE alumno.
    await connection.query(
      `UPDATE seguimiento sg
       JOIN solicitudes s ON s.id = sg.solicitud_id
       SET sg.leido = 1
       WHERE s.estudiante_id = ? AND sg.leido = 0`,
      [estudianteId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Dejamos "router" disponible para que server.ts lo importe.
export default router;