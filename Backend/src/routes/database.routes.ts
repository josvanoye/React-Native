import { Router } from "express";
import connection from "../database/connection";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [resultado] = await connection.query("SELECT 1");

    res.json({
      conectado: true,
      resultado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      conectado: false,
      mensaje: "No se pudo conectar a MySQL",
    });
  }
});

export default router;
