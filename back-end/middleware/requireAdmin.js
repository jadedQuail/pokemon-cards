const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.isAdmin) {
            return res.sendStatus(403);
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.sendStatus(403);
    }
}

module.exports = isAdmin;
