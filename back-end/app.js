import "dotenv/config";
import express from "express";
import cors from "cors";

import pokemonRoutes from "./routes/pokemonRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === "true";
const ALLOW_LIST = [process.env.FRONTEND];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOW_ALL_ORIGINS || ALLOW_LIST.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => {
    res.sendStatus(200);
});

app.use("/pokemon", pokemonRoutes);
app.use("/types", typeRoutes);
app.use("/sets", setRoutes);
app.use("/auth", authRoutes);

export default app;
