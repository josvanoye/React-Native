import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import databaseRoutes from "./routes/database.routes";
import testRoutes from "./routes/test.routes";
import adminRoutes from "./routes/admin.routes";  

import documentosRoutes from "./routes/documentos.routes";
import solicitudesRoutes from "./routes/solicitudes.routes";

import notificacionesRoutes from "./routes/notificaciones.routes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/admin", adminRoutes);                // <- junto a los otros app.use
app.use("/api/notificaciones", notificacionesRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);  //z   http://localhost:${PORT}`);
});
