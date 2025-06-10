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

describe("GET /sets", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns 200 with an array of set names", async () => {
        const rows = [{ set_name: "Base" }, { set_name: "Jungle" }];
        db.pool.query.mockResolvedValueOnce([rows]);

        const res = await request(app).get("/sets");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(["Base", "Jungle"]);
        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/^SELECT set_name FROM Sets;$/)
        );
    });

    it("returns 500 if the database throws", async () => {
        const error = new Error("DB failure");
        db.pool.query.mockRejectedValueOnce(error);

        const res = await request(app).get("/sets");

        expect(res.status).toBe(500);
    });
});
