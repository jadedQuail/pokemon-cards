import jwt from "jsonwebtoken";

export default function requireAdminOrApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
        return next();
    }

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
