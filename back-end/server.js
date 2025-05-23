require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const pokemonRoutes = require("./routes/pokemonRoutes");
const typeRoutes = require("./routes/typeRoutes");
const setRoutes = require("./routes/setRoutes");
const authRoutes = require("./routes/authRoutes");

// TODO: Move pokemon-related functions into own route/controller file

// TODO: Clean up npm vulnerabilities

const allowlist = [process.env.FRONTEND];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowlist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },

    // // Testing purposes only - allow any origin
    // origin: function (origin, callback) {
    //     callback(null, true);
    // },
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
