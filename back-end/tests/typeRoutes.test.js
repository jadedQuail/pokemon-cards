import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import db from "../database/db-connector.js";
import { CategoryErrorCodes } from "../../shared/errorCodes.js";

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

    it("should return 400 if typeName contains invalid characters", async () => {
        const invalidName = "Bad!Name";

        const res = await request(app)
            .post("/types")
            .send({ typeName: invalidName });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errorCode: CategoryErrorCodes.INVALID_CHARACTERS,
        });
    });

    it("returns 409 if the type already exists", async () => {
        const dupErr = new Error();
        dupErr.code = "ER_DUP_ENTRY";
        db.pool.query.mockRejectedValueOnce(dupErr);

        const res = await request(app)
            .post("/types")
            .send({ typeName: "ExistingType" });

        expect(res.status).toBe(409);

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(
                /^INSERT INTO Types \(type_name\) VALUES \(\?\);$/
            ),
            ["ExistingType"]
        );
    });

    it("returns 500 if the database throws an unexpected error", async () => {
        const genericError = new Error("DB failure");
        db.pool.query.mockRejectedValueOnce(genericError);

        const res = await request(app)
            .post("/types")
            .send({ typeName: "ValidName" });

        expect(res.status).toBe(500);

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(
                /^INSERT INTO Types \(type_name\) VALUES \(\?\);$/
            ),
            ["ValidName"]
        );
    });
});

describe("DELETE /types/:type", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns 200 and calls the DELETE query", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app).delete("/types/OldType");

        expect(res.status).toBe(200);
        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/^DELETE FROM Types WHERE type_name = \?$/),
            ["OldType"]
        );
    });

    it("returns 500 if the database throws an error", async () => {
        const genericError = new Error("DB failure");
        db.pool.query.mockRejectedValueOnce(genericError);

        const res = await request(app).delete("/types/SomeType");

        expect(res.status).toBe(500);
        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/^DELETE FROM Types WHERE type_name = \?$/),
            ["SomeType"]
        );
    });
});
