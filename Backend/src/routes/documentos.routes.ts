// Traemos de Express lo que necesitamos:
// Router = un mini-servidor donde definimos rutas; Request/Response = tipos de la petición y la respuesta
import { Router, Request, Response } from "express";

// RowDataPacket = tipo base de una fila que devuelve MySQL
import { RowDataPacket } from "mysql2";

// La conexión a MySQL (un pool de conexiones). Es la que armó Joseline, y la usamos las dos
import connection from "../database/connection";

// Describe cómo es UNA fila de la tabla documentos. Así TypeScript sabe qué campos existen
interface Documento extends RowDataPacket {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  dias_estimados: number;
  formato: string;
  vigencia_dias: number | null;   // "number | null" = un número, o nulo si el documento no caduca
  icono: string | null;
}

// Las columnas que pedimos, escritas una sola vez para usarlas en las dos consultas
const COLUMNAS =
  "id, nombre, descripcion, costo, dias_estimados, formato, vigencia_dias, icono";

// Creamos el grupo de rutas. server.ts lo conecta con app.use("/api/documentos", ...)
const router = Router();

// GET /api/documentos -> catálogo completo (pantalla "Solicitar documento")
// RUTA 1: GET /api/documentos  ->  devuelve el catálogo completo
// "/" aquí significa "la raíz de /api/documentos". _req lleva guion bajo porque no la usamos
router.get("/", async (_req: Request, res: Response) => {
  try {
    // await = espera a que MySQL responda antes de seguir
    // [filas] = MySQL devuelve [filas, info]; solo nos interesa la primera parte
    // <Documento[]> = le decimos a TypeScript que "filas" es una lista de Documento
    const [filas] = await connection.query<Documento[]>(

      // disponible = 1 -> solo los documentos activos; ORDER BY id -> siempre el mismo orden
      `SELECT ${COLUMNAS} FROM documentos WHERE disponible = 1 ORDER BY id`
    );
    res.json(filas); // respondemos la lista en formato JSON (código 200 por defecto)
  } catch (err) {

    // Si algo falla (por ejemplo MySQL apagado), llegamos aquí
    console.error(err);  // se imprime en la terminal del servidor, para que tú veas qué pasó

    res.status(500).json({ error: "Error al consultar el catálogo" }); // 500 = falló el servidor
  }
});

// GET /api/documentos/:id -> un documento (pantalla de detalle)
// RUTA 2: GET /api/documentos/3  ->  devuelve un solo documento
// ":id" es una variable: lo que venga en la dirección queda en req.params.id
router.get("/:id", async (req: Request, res: Response) => {

  // Lo que llega en la dirección siempre es texto, así que lo convertimos a número
  const id = Number(req.params.id);

   // Si no es un número entero (por ejemplo /documentos/abc), la petición está mal hecha
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Id inválido" }); // 400 = petición incorrecta
    return;  // IMPORTANTE: detiene la función; sin esto seguiría ejecutando lo de abajo
  }

  try {
    const [filas] = await connection.query<Documento[]>(
      // El "?" se llena con el valor de [id]. Así el valor viaja aparte de la consulta
      // y nadie puede meter SQL malicioso (esto evita la "inyección SQL")
      `SELECT ${COLUMNAS} FROM documentos WHERE id = ? AND disponible = 1`,
      [id]
    );
    // Si la lista salió vacía, ese documento no existe o está oculto
    if (filas.length === 0) {
      res.status(404).json({ error: "Documento no encontrado" });  // 404 = no existe
      return;
    }
    res.json(filas[0]);   // filas[0] = el primer (y único) resultado
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar el documento" });
  }
});


// Dejamos "router" disponible para que server.ts lo importe
export default router;
