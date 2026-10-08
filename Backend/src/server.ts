import express from "express";
import databaseRoutes from "./routes/database.routes";
import testRoutes from "./routes/test.routes";

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/database", databaseRoutes);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
