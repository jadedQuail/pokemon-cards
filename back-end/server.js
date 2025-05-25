require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === "true";
const ALLOW_LIST = [process.env.FRONTEND];

const pokemonRoutes = require("./routes/pokemonRoutes");
const typeRoutes = require("./routes/typeRoutes");
const setRoutes = require("./routes/setRoutes");
const authRoutes = require("./routes/authRoutes");

// TODO: Clean up npm vulnerabilities on the back-end
// TODO: Get nuxt and other package files out of my search results in VS Code

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
