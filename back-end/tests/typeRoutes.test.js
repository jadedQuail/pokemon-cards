import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import db from "../database/db-connector.js";

vi.mock("../database/db-connector.js", () => ({
    default: {
        pool: {
            query: vi.fn(),
        },
    },
}));

vi.mock("../middleware/requireAdmin.js", () => ({
    default: (_req, _res, next) => next(),
}));

describe("GET /types", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should return a list of types with status 200", async () => {
        const mockRows = [
            { type_name: "Fire" },
            { type_name: "Water" },
            { type_name: "Grass" },
        ];

        db.pool.query.mockResolvedValueOnce([mockRows]);

        const res = await request(app).get("/types");

        expect(db.pool.query).toHaveBeenCalledWith(
            "SELECT type_name FROM Types;"
        );
        expect(res.status).toBe(200);
        expect(res.body).toEqual(["Fire", "Water", "Grass"]);
    });

    it("should return status 500 if the database query throws an error", async () => {
        const mockError = new Error("DB failure");

        db.pool.query.mockRejectedValueOnce(mockError);

        const res = await request(app).get("/types");

        expect(db.pool.query).toHaveBeenCalledWith(
            "SELECT type_name FROM Types;"
        );
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(res.status).toBe(500);
    });
});

describe("POST /types", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should return status 201 on successful insert", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/types")
            .send({ typeName: "NewType" });

        expect(db.pool.query).toHaveBeenCalledWith(
            "INSERT INTO Types (type_name) VALUES (?);",
            ["NewType"]
        );

        expect(res.status).toBe(201);
    });
});
