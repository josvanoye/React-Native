// =====================================================================
// Backend/src/routes/admin.routes.ts
//
// QUÉ ES: las rutas del LADO ADMINISTRATIVO de PoliDoc. Las usa el personal de
//   Servicios Escolares para: ver las solicitudes, aprobar o rechazar pagos y
//   cambiar el estatus de cada trámite hasta entregar el documento.
//
// POR QUÉ ESTÁ EN Backend/src/routes/: en esta carpeta va un archivo por tema
//   (documentos, solicitudes, admin...). Así cada quien trabaja en su archivo
//   y casi no hay conflictos en git. server.ts los conecta con app.use(...).
//
// CÓMO SE CONECTA: en server.ts va
//     import adminRoutes from "./routes/admin.routes";
//     app.use("/api/admin", adminRoutes);
//   Por eso cada ruta de abajo empieza con /api/admin/...
//
// PENDIENTE ANTES DE ENTREGAR (por eso dicen TEMPORAL):
//   1) Estas rutas todavía NO verifican que quien llama sea administrador.
//      Hay que usar el middleware de sesión de Joseline (ver "TODO" más abajo).
//   2) ID_ADMIN_TEMPORAL debe salir del token del administrador que inició sesión.
// =====================================================================

// Router = un mini-servidor donde definimos rutas.
// Request y Response = los tipos de la petición (lo que llega) y la respuesta (lo que mandamos).
import { Router, Request, Response } from "express";

// RowDataPacket = tipo base de una fila que devuelve MySQL (lo extendemos abajo).
import { RowDataPacket } from "mysql2";

// La conexión a MySQL de Joseline. Es un "pool": un grupo de conexiones reutilizables.
// Es la misma que ya usan documentos.routes.ts y solicitudes.routes.ts.
import connection from "../database/connection";

// Tipo de UNA conexión sacada del pool. Se deduce de connection.getConnection() para
// que siempre coincida con la librería que usa Joseline (así no tenemos que adivinarlo).
type Conexion = Awaited<ReturnType<typeof connection.getConnection>>;

// ---------------------------------------------------------------------
// 1) LOS ESTATUS
// Son los mismos números que la tabla "estatus" de la base de datos.
// Se escriben con nombre para no usar "números mágicos" (es más fácil leer
// ESTATUS.PAGO_VALIDADO que un 4 suelto).  "as const" = valores que no cambian.
// ---------------------------------------------------------------------
const ESTATUS = {
  SOLICITUD_ENVIADA: 1,
  FICHA_GENERADA: 2,
  PAGO_EN_BANCO: 3,
  PAGO_VALIDADO: 4,
  EN_PREPARACION: 5,
  LISTO_PARA_RECOGER: 6,
  ENTREGADO: 7,
  CANCELADA: 8,
  PAGO_RECHAZADO: 9,
} as const;

// Qué estatus sigue cuando el administrador presiona "Avanzar".
// Lee cada renglón como "si está en X, pasa a Y". Si una solicitud está en un
// estatus que NO aparece aquí (por ejemplo, Entregado), no se puede avanzar.
// Nota: validar el pago (3 -> 4) NO está aquí, tiene su propia ruta.
const SIGUIENTE: Record<number, number> = {
  [ESTATUS.FICHA_GENERADA]: ESTATUS.PAGO_EN_BANCO,
  [ESTATUS.PAGO_VALIDADO]: ESTATUS.EN_PREPARACION,
  [ESTATUS.EN_PREPARACION]: ESTATUS.LISTO_PARA_RECOGER,
  [ESTATUS.LISTO_PARA_RECOGER]: ESTATUS.ENTREGADO,
};

// Ventanilla que se anota cuando el documento queda "Listo para recoger"
// (si el administrador no escribe otra).
const VENTANILLA_POR_DEFECTO = "Ventanilla 3";

// TEMPORAL: id del administrador que hace el cambio. Debe existir en la tabla
// "administradores", porque seguimiento y solicitudes lo guardan con llave foránea.
// Cuando esté el login con token, se reemplaza por el id del administrador de la sesión.
const ID_ADMIN_TEMPORAL = 1;

// Creamos el grupo de rutas de este archivo.
const router = Router();

// TODO (cuando tengas el middleware de Joseline): proteger TODAS las rutas de abajo.
//   router.use(soloAdministradores);
// Debe verificar el token y que el rol sea "administrador". Sin esto, cualquiera que
// llegue al servidor podría validar pagos.

// ---------------------------------------------------------------------
// 2) TIPOS DE LAS FILAS QUE DEVUELVE MySQL
// Le dicen a TypeScript qué columnas esperar. No existen al ejecutar: solo
// ayudan al editor a avisarte si escribes mal un nombre de campo.
// ---------------------------------------------------------------------
interface FilaSolicitud extends RowDataPacket {
  id: number;
  folio: string;
  copias: number;
  importe_total: number; // MySQL puede entregarlo como texto "360.00"; la app lo convierte con Number()
  estatus_id: number;
  estatus: string; // nombre del estatus ("Pago en banco", etc.)
  fecha_solicitud: Date;
  matricula: string;
  alumno: string;
  documento: string;
  referencia: string | null; // null si por algún motivo no hay ficha
  fecha_limite: string | null;
  pago_validado: number | null; // 0 o 1
}

interface FilaEstatus extends RowDataPacket {
  estatus_id: number;
}

interface FilaConteo extends RowDataPacket {
  estatus_id: number;
  total: number;
}

// ---------------------------------------------------------------------
// 3) FUNCIONES DE APOYO (se usan en varias rutas, por eso se escriben una sola vez)
// ---------------------------------------------------------------------

// Convierte el :id de la dirección (que llega como texto) en un número entero positivo.
// Devuelve null si no sirve (por ejemplo "abc", "0" o "-3").
function idValido(valor: string): number | null {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Lee el estatus actual de una solicitud. Devuelve null si la solicitud no existe.
// FOR UPDATE = "bloquea esta fila hasta que termine mi transacción". Sirve para que
// dos administradores no cambien la misma solicitud al mismo tiempo.
// (FOR UPDATE solo funciona dentro de una transacción, y aquí siempre lo es.)
async function estatusActual(conn: Conexion, id: number): Promise<number | null> {
  const [filas] = await conn.query<FilaEstatus[]>(
    "SELECT estatus_id FROM solicitudes WHERE id = ? FOR UPDATE",
    [id]
  );
  return filas.length > 0 ? filas[0].estatus_id : null;
}

// Cambia el estatus de una solicitud y deja constancia en "seguimiento".
// - Actualiza la solicitud: nuevo estatus, quién la atendió y (opcional) la ventanilla.
//   COALESCE(?, ventanilla) = "usa el valor nuevo; si es NULL, conserva el que ya tenía".
// - Inserta una fila en "seguimiento": de ahí sale la línea de tiempo que ve el alumno
//   y los avisos de la siguiente semana. NUNCA se cambia el estatus sin dejar esta fila.
async function aplicarEstatus(
  conn: Conexion,
  solicitudId: number,
  nuevo: number,
  adminId: number,
  ventanilla?: string
): Promise<void> {
  await conn.query(
    `UPDATE solicitudes
     SET estatus_id = ?, administrador_id = ?, ventanilla = COALESCE(?, ventanilla)
     WHERE id = ?`,
    [nuevo, adminId, ventanilla ?? null, solicitudId]
  );
  await conn.query(
    "INSERT INTO seguimiento (solicitud_id, estatus_id, administrador_id) VALUES (?, ?, ?)",
    [solicitudId, nuevo, adminId]
  );
}

// Tipo de una función opcional que se ejecuta DENTRO de la misma transacción,
// justo después de cambiar el estatus (para cosas extra, como marcar la ficha como pagada).
type Despues = (conn: Conexion, solicitudId: number, nuevo: number) => Promise<void>;

// ESTA ES LA FUNCIÓN CENTRAL del archivo. Cambia el estatus de forma segura:
//   1. Abre una TRANSACCIÓN: o se hace todo, o no se hace nada.
//   2. Lee el estatus actual (y bloquea la fila).
//   3. Verifica que esa acción esté permitida desde ese estatus ("permitidos").
//      Si no, responde 409 (conflicto): por ejemplo, validar un pago que ya está validado.
//   4. Calcula el estatus nuevo con "destino" y lo aplica.
//   5. Ejecuta el paso extra, si lo hay.
//   6. commit = confirma todo. Si algo falla: rollback = deshace todo.
//   7. finally: devuelve la conexión al pool SIEMPRE (si no, el pool se agota).
// Por qué existe: sin ella, validar, rechazar, avanzar y cancelar repetirían las
// mismas 30 líneas de transacción cuatro veces.
async function transicion(
  res: Response,
  id: number,
  permitidos: number[],
  destino: (actual: number) => number,
  opciones: { extra?: Despues } = {}
): Promise<void> {
  const conn = await connection.getConnection(); // toma UNA conexión del pool
  try {
    await conn.beginTransaction();

    const actual = await estatusActual(conn, id);
    if (actual === null) {
      await conn.rollback();
      res.status(404).json({ error: "Solicitud no encontrada" }); // 404 = no existe
      return;
    }
    if (!permitidos.includes(actual)) {
      await conn.rollback();
      // 409 = la acción choca con el estado actual de la solicitud
      res.status(409).json({ error: "Esa acción no se puede hacer en el estatus actual", estatus_actual: actual });
      return;
    }

    const nuevo = destino(actual);
    await aplicarEstatus(conn, id, nuevo, ID_ADMIN_TEMPORAL);
    if (opciones.extra) await opciones.extra(conn, id, nuevo);

    await conn.commit();
    res.json({ id, estatus_id: nuevo });
  } catch (err) {
    await conn.rollback(); // si algo falló a la mitad, se deshace todo
    console.error(err); // se imprime en la terminal del servidor para que veas qué pasó
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    conn.release();
  }
}

// ---------------------------------------------------------------------
// 4) RUTA: GET /api/admin/solicitudes
//    Lista las solicitudes (la pantalla "Solicitudes" del administrador).
//    Filtros opcionales en la dirección:
//      ?estatus=3        solo las que están en ese estatus
//      ?buscar=Sofia     busca en nombre del alumno, matrícula o folio
// ---------------------------------------------------------------------
router.get("/solicitudes", async (req: Request, res: Response) => {
  // Lo que llega en ?estatus=... y ?buscar=... es texto; se revisa antes de usarlo.
  const rawEstatus = typeof req.query.estatus === "string" ? req.query.estatus : "";
  const estatus = rawEstatus === "" ? NaN : Number(rawEstatus);
  const buscar = typeof req.query.buscar === "string" ? req.query.buscar.trim() : "";

  // Armamos el WHERE según los filtros que sí llegaron.
  // Las condiciones son texto FIJO con "?"; los valores van aparte en "valores".
  // Así nadie puede meter SQL malicioso (inyección SQL).
  const condiciones: string[] = [];
  const valores: (string | number)[] = [];

  if (Number.isInteger(estatus)) {
    condiciones.push("s.estatus_id = ?");
    valores.push(estatus);
  }
  if (buscar !== "") {
    condiciones.push("(est.nombre_completo LIKE ? OR est.matricula LIKE ? OR s.folio LIKE ?)");
    const like = `%${buscar}%`; // % = "cualquier texto antes o después"
    valores.push(like, like, like);
  }
  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

  try {
    // JOIN = unir tablas por sus llaves, para traer nombres en vez de solo números:
    //   solicitudes  + estudiantes (quién la pidió)
    //                + documentos  (qué pidió)
    //                + estatus     (nombre de la etapa)
    //   LEFT JOIN fichas_pago: trae la ficha si existe; si no, la solicitud sale igual.
    // DATE_FORMAT(...) entrega la fecha límite como texto 'AAAA-MM-DD' para que no
    // se corra un día por la zona horaria.
    const [filas] = await connection.query<FilaSolicitud[]>(
      `SELECT s.id, s.folio, s.copias, s.importe_total, s.estatus_id,
              e.nombre AS estatus, s.fecha_solicitud,
              est.matricula, est.nombre_completo AS alumno,
              d.nombre AS documento,
              f.referencia,
              DATE_FORMAT(f.fecha_limite, '%Y-%m-%d') AS fecha_limite,
              f.pago_validado
       FROM solicitudes s
       JOIN estudiantes est ON est.id = s.estudiante_id
       JOIN documentos d ON d.id = s.documento_id
       JOIN estatus e ON e.id = s.estatus_id
       LEFT JOIN fichas_pago f ON f.solicitud_id = s.id
       ${where}
       ORDER BY s.fecha_solicitud DESC`,
      valores
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar las solicitudes" });
  }
});

// ---------------------------------------------------------------------
// 5) RUTA: GET /api/admin/metricas
//    Los contadores del Panel del administrador (cuántas solicitudes hay en cada etapa).
// ---------------------------------------------------------------------
router.get("/metricas", async (_req: Request, res: Response) => {
  try {
    // GROUP BY = agrupa las filas por estatus; COUNT(*) cuenta cuántas hay en cada grupo.
    const [filas] = await connection.query<FilaConteo[]>(
      "SELECT estatus_id, COUNT(*) AS total FROM solicitudes GROUP BY estatus_id"
    );

    // Pasamos la lista a un "diccionario": { 2: 5, 3: 1, ... } (estatus -> cantidad).
    const porEstatus: Record<number, number> = {};
    for (const f of filas) porEstatus[f.estatus_id] = Number(f.total);

    // suma(2, 3) = cuántas solicitudes hay entre los estatus 2 y 3 juntos.
    // "?? 0" = si no hay ninguna en ese estatus, cuenta 0.
    const suma = (...ids: number[]) => ids.reduce((acc, id) => acc + (porEstatus[id] ?? 0), 0);
    const total = Object.values(porEstatus).reduce((acc, n) => acc + n, 0);

    res.json({
      total,
      pendientes_pago: suma(ESTATUS.FICHA_GENERADA), // todavía no pagan
      por_validar: suma(ESTATUS.PAGO_EN_BANCO), // pagaron y falta que el administrador valide
      en_preparacion: suma(ESTATUS.PAGO_VALIDADO, ESTATUS.EN_PREPARACION),
      listos_entregados: suma(ESTATUS.LISTO_PARA_RECOGER, ESTATUS.ENTREGADO),
      por_estatus: porEstatus, // el detalle completo, por si la pantalla lo necesita
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar las métricas" });
  }
});

// ---------------------------------------------------------------------
// 6) RUTA: PATCH /api/admin/solicitudes/:id/validar-pago
//    El administrador comprueba que el alumno sí pagó. Se permite desde
//    "Ficha generada" o "Pago en banco".
//    Además de cambiar el estatus a "Pago validado", marca la ficha como pagada
//    y anota QUIÉN la validó y CUÁNDO.
//    (PATCH = "modificar una parte de algo que ya existe".)
// ---------------------------------------------------------------------
router.patch("/solicitudes/:id/validar-pago", async (req: Request, res: Response) => {
  const id = idValido(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Id inválido" }); // 400 = petición mal hecha
    return;
  }
  await transicion(
    res,
    id,
    [ESTATUS.FICHA_GENERADA, ESTATUS.PAGO_EN_BANCO], // desde qué estatus se permite
    () => ESTATUS.PAGO_VALIDADO, // a cuál pasa
    {
      // Paso extra, dentro de la MISMA transacción: si falla, también se deshace el cambio de estatus.
      extra: async (conn, solicitudId) => {
        await conn.query(
          `UPDATE fichas_pago
           SET pago_validado = 1, validado_por = ?, fecha_validacion = NOW()
           WHERE solicitud_id = ?`,
          [ID_ADMIN_TEMPORAL, solicitudId]
        );
      },
    }
  );
});

// ---------------------------------------------------------------------
// 7) RUTA: PATCH /api/admin/solicitudes/:id/rechazar-pago
//    El pago no es válido (referencia incorrecta, monto distinto...).
//    La solicitud pasa a "Pago rechazado".
// ---------------------------------------------------------------------
router.patch("/solicitudes/:id/rechazar-pago", async (req: Request, res: Response) => {
  const id = idValido(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Id inválido" });
    return;
  }
  await transicion(
    res,
    id,
    [ESTATUS.FICHA_GENERADA, ESTATUS.PAGO_EN_BANCO],
    () => ESTATUS.PAGO_RECHAZADO
  );
});

// ---------------------------------------------------------------------
// 8) RUTA: PATCH /api/admin/solicitudes/:id/avanzar
//    El botón "Avanzar" de la pantalla: pasa la solicitud a la siguiente etapa
//    según el mapa SIGUIENTE de arriba.
//    Cuerpo opcional: { "ventanilla": "Ventanilla 2" } (solo se usa al llegar a
//    "Listo para recoger", para decirle al alumno a dónde ir).
// ---------------------------------------------------------------------
router.patch("/solicitudes/:id/avanzar", async (req: Request, res: Response) => {
  const id = idValido(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Id inválido" });
    return;
  }
  // "?." = si no llegó cuerpo, no falla. Solo aceptamos la ventanilla si es texto.
  const enviada = typeof req.body?.ventanilla === "string" ? req.body.ventanilla.trim() : "";

  await transicion(
    res,
    id,
    Object.keys(SIGUIENTE).map(Number), // los estatus desde los que SÍ se puede avanzar
    (actual) => SIGUIENTE[actual], // busca cuál sigue en el mapa
    {
      extra: async (conn, solicitudId, nuevo) => {
        // La ventanilla solo se guarda cuando el documento queda listo para recoger.
        if (nuevo === ESTATUS.LISTO_PARA_RECOGER) {
          await conn.query("UPDATE solicitudes SET ventanilla = ? WHERE id = ?", [
            enviada !== "" ? enviada : VENTANILLA_POR_DEFECTO,
            solicitudId,
          ]);
        }
      },
    }
  );
});

// ---------------------------------------------------------------------
// 9) RUTA: PATCH /api/admin/solicitudes/:id/cancelar
//    Cancela una solicitud, pero solo ANTES de que esté pagada (estatus 1, 2 o 3).
//    Si ya se pagó, responde 409.
//    Se cambia el estatus a "Cancelada" y NO se borra la fila: así queda historial.
// ---------------------------------------------------------------------
router.patch("/solicitudes/:id/cancelar", async (req: Request, res: Response) => {
  const id = idValido(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Id inválido" });
    return;
  }
  await transicion(
    res,
    id,
    [ESTATUS.SOLICITUD_ENVIADA, ESTATUS.FICHA_GENERADA, ESTATUS.PAGO_EN_BANCO],
    () => ESTATUS.CANCELADA
  );
});

// Dejamos "router" disponible para que server.ts lo importe.
export default router;