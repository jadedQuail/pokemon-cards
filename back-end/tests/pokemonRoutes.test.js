import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

vi.mock("../database/db-connector.js", () => ({
    default: {
        pool: {
            query: vi.fn(),
        },
    },
}));

import db from "../database/db-connector.js";

describe("GET /pokemon", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return a list of Pokémon with status 200", async () => {
        const mockData = [
            {
                id: 1,
                name: "Pikachu",
                hp: 35,
                type: "Electric",
                set: "Base",
                flavorText: "A mouse Pokémon.",
            },
        ];

        db.pool.query.mockResolvedValue([mockData]);

        const res = await request(app).get("/pokemon");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockData);
    });
});
