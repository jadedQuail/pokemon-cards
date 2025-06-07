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

vi.mock("../middleware/requireAdmin.js", () => ({
    default: (_req, _res, next) => next(),
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

    it("returns 500 if the database query throws", async () => {
        db.pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).get("/pokemon");
        expect(res.status).toBe(500);
    });
});

describe("POST /pokemon/add", () => {
    const newPokemon = {
        pokemonName: "Charmander",
        pokemonHP: 39,
        pokemonFlavorText: "Lizard Pokemon!",
        pokemonType: "Fire",
        pokemonSet: "Base",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("inserts a new Pokémon and returns 201 (no body)", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/pokemon/add")
            .send(newPokemon)
            .set("Accept", "application/json");

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/INSERT\s+INTO\s+Pokemon/i),
            [
                newPokemon.pokemonName,
                newPokemon.pokemonHP,
                newPokemon.pokemonFlavorText,
                newPokemon.pokemonType,
                newPokemon.pokemonSet,
            ]
        );
    });

    it("returns 500 if the insert throws", async () => {
        db.pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).post("/pokemon/add").send(newPokemon);
        expect(res.status).toBe(500);
    });
});

describe("POST /pokemon/edit/:id", () => {
    const updatedPokemon = {
        pokemonName: "Charizard",
        pokemonHP: 78,
        pokemonFlavorText: "Flame Pokémon.",
        pokemonType: "Fire",
        pokemonSet: "Base",
    };
    const pokemonId = "42";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 200 when the update succeeds", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post(`/pokemon/edit/${pokemonId}`)
            .send(updatedPokemon)
            .set("Accept", "application/json");

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/UPDATE\s+Pokemon/i),
            [
                updatedPokemon.pokemonName,
                updatedPokemon.pokemonHP,
                updatedPokemon.pokemonFlavorText,
                updatedPokemon.pokemonType,
                updatedPokemon.pokemonSet,
                pokemonId,
            ]
        );

        expect(res.status).toBe(200);
    });

    it("returns 500 if the update throws", async () => {
        db.pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app)
            .post(`/pokemon/edit/${pokemonId}`)
            .send(updatedPokemon);

        expect(res.status).toBe(500);
    });
});

describe("DELETE /pokemon/:id", () => {
    const pokemonId = "42";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 200 when delete succeeds", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app).delete(`/pokemon/${pokemonId}`);

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/DELETE\s+FROM\s+Pokemon/i),
            [pokemonId]
        );

        expect(res.status).toBe(200);
    });

    it("returns 500 if the delete throws", async () => {
        db.pool.query.mockRejectedValueOnce(new Error("DB failure"));

        const res = await request(app).delete(`/pokemon/${pokemonId}`);

        expect(res.status).toBe(500);
    });
});
