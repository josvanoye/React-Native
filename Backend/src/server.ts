import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import databaseRoutes from "./routes/database.routes";
import testRoutes from "./routes/test.routes";

import documentosRoutes from "./routes/documentos.routes";
import solicitudesRoutes from "./routes/solicitudes.routes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
