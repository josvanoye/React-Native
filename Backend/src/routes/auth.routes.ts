import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import connection from "../database/connection";

const router = Router();

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  matricula: string | null;
  email: string;
  role: "alumno" | "admin";
  password_hash: string;
};

type PublicUser = {
  id: number;
  nombre: string;
  matricula: string | null;
  correo: string;
  rol: "alumno" | "admin";
};

function publicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    nombre: user.name,
    matricula: user.matricula,
    correo: user.email,
    rol: user.role,
  };
}

function isDuplicateEntry(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ER_DUP_ENTRY";
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("Configura JWT_SECRET con al menos 32 bytes en Backend/.env");
  }
  return secret;
}

router.post("/register", async (req, res) => {
  const nombre = typeof req.body?.nombre === "string" ? req.body.nombre.trim() : "";
  const matricula = typeof req.body?.matricula === "string" ? req.body.matricula.trim() : "";
  const carrera = typeof req.body?.carrera === "string" ? req.body.carrera.trim() : "";
  const correo = typeof req.body?.correo === "string" ? req.body.correo.trim().toLowerCase() : "";
  const cuatrimestre = Number(req.body?.cuatrimestre);
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const passwordBytes = Buffer.byteLength(password, "utf8");

  if (
    !nombre ||
    nombre.length > 100 ||
    !matricula ||
    matricula.length > 10 ||
    !carrera ||
    carrera.length > 80 ||
    !Number.isInteger(cuatrimestre) ||
    cuatrimestre < 1 ||
    cuatrimestre > 15 ||
    correo.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
    passwordBytes < 8 ||
    passwordBytes > 72
  ) {
    res.status(400).json({
      mensaje: "Revisa tus datos: completa los campos, verifica el correo y usa un cuatrimestre de 1 a 15.",
    });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO estudiantes
        (matricula, nombre_completo, carrera, cuatrimestre, correo_institucional, contrasena)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [matricula, nombre, carrera, cuatrimestre, correo, passwordHash],
    );

    res.status(201).json({
      usuario: {
        id: result.insertId,
        nombre,
        matricula,
        correo,
        rol: "alumno",
      } satisfies PublicUser,
    });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      res.status(409).json({ mensaje: "La matrícula o el correo ya están registrados." });
      return;
    }

    console.error("Error al registrar estudiante:", error);
    res.status(500).json({ mensaje: "No se pudo crear la cuenta." });
  }
});

router.post("/login", async (req, res) => {
  const cuenta = typeof req.body?.cuenta === "string" ? req.body.cuenta.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!cuenta || !password) {
    res.status(400).json({ mensaje: "Ingresa tu matrícula/correo o correo administrativo y contraseña." });
    return;
  }

  try {
    const [users] = await connection.execute<UserRow[]>(
      `SELECT id, nombre_completo AS name, matricula,
              correo_institucional AS email, 'alumno' AS role,
              contrasena AS password_hash
       FROM estudiantes
       WHERE matricula = ? OR correo_institucional = ?
       UNION ALL
       SELECT id, nombre_completo AS name, NULL AS matricula,
              correo_institucional AS email, 'admin' AS role,
              contrasena AS password_hash
       FROM administradores
       WHERE correo_institucional = ?
       LIMIT 2`,
      [cuenta, cuenta, cuenta],
    );
    const user = users.length === 1 ? users[0] : undefined;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
      return;
    }

    const token = jwt.sign(
      { rol: user.role },
      getJwtSecret(),
      { subject: String(user.id), expiresIn: "8h" },
    );

    res.json({ token, usuario: publicUser(user) });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "No se pudo iniciar sesión." });
  }
});

export default router;
