import "dotenv/config";
import express from "express";
import cors from "cors";

import pokemonRoutes from "./routes/pokemonRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === "true";
const ALLOW_LIST = [process.env.FRONTEND];

// TODO: Clean up npm vulnerabilities on the back-end
// TODO: Convert the back-end to ES Modules ("import") from CommonJS ("require")
// TODO: Create a unit test and journey tests for this app

const corsOptions = {
    origin: function (origin, callback) {
        if (ALLOW_ALL_ORIGINS || ALLOW_LIST.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/pokemon", pokemonRoutes);
app.use("/types", typeRoutes);
app.use("/sets", setRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Example app is listening on port ${PORT}.`);
});
