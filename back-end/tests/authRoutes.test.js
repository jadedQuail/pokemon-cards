import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

vi.mock("../middleware/registerLimiter.js", () => ({
    registerLimiter: (_req, _res, next) => next(),
}));

vi.mock("../database/db-connector.js", () => ({
    default: {
        pool: {
            query: vi.fn(),
        },
    },
}));

vi.mock("bcrypt", () => ({
    __esModule: true,
    default: {
        hash: vi.fn().mockResolvedValue("hashed-password"),
    },
}));

vi.mock("../utils/credentialValidator.js", () => ({
    validateUsernameChoice: vi.fn().mockReturnValue({ valid: true }),
    validatePasswordChoice: vi.fn().mockReturnValue({ valid: true }),
}));

import db from "../database/db-connector.js";
import bcrypt from "bcrypt";
import {
    validateUsernameChoice,
    validatePasswordChoice,
} from "../utils/credentialValidator.js";

describe("POST /auth/create-user", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("hashes the password, inserts a new user, and returns 201", async () => {
        db.pool.query.mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/auth/create-user")
            .send({
                username: "newuser",
                password: "s3crets!",
                confirmPassword: "s3crets!",
            })
            .set("Accept", "application/json");

        expect(validateUsernameChoice).toHaveBeenCalledWith("newuser");
        expect(validatePasswordChoice).toHaveBeenCalledWith(
            "s3crets!",
            "s3crets!"
        );

        expect(bcrypt.hash).toHaveBeenCalledWith("s3crets!", 10);

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(/INSERT\s+INTO\s+Users/i),
            ["newuser", "hashed-password", false]
        );

        expect(res.status).toBe(201);
    });
});
