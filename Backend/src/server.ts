import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import databaseRoutes from "./routes/database.routes";
import testRoutes from "./routes/test.routes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/database", databaseRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
