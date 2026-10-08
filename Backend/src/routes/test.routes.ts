import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    mensaje: "El backend funciona correctamente",
  });
});

export default router;
