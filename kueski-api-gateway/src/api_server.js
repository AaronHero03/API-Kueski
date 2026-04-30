// src/api_server.js
import "dotenv/config";
import express from "express";
import cors from "cors";

// Importar las rutas modulares
import commerceRoutes from "./routes/commerce.routes.js";
2;
import usersRoutes from "./routes/users.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Montar las rutas en prefijos específicos
app.use("/commerce", commerceRoutes); // Todas empezarán con /commerce
app.use("/users", usersRoutes); // Todas empezarán con /users

app.use((req, res) => {
	res.status(404).send("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
});

app.listen(PORT, () => {
	console.log(`🚀 Kueski BFF Gateway corriendo en http://localhost:${PORT}`);
});
