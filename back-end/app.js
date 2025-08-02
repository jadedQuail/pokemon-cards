import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pokemonRoutes from "./routes/pokemonRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.sendStatus(200);
});

app.use("/pokemon", pokemonRoutes);
app.use("/types", typeRoutes);
app.use("/sets", setRoutes);
app.use("/auth", authRoutes);

const nuxtStaticPath = path.join(__dirname, "../front-end/.output/public");
app.use(express.static(nuxtStaticPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(nuxtStaticPath, "index.html"));
});

export default app;
