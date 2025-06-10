import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { RegistrationErrorCodes } from "../../shared/errorCodes.js";
import db from "../database/db-connector.js";
import bcrypt from "bcrypt";
import {
    validateUsernameChoice,
    validatePasswordChoice,
} from "../utils/credentialValidator.js";

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
        compare: vi.fn(),
    },
}));

vi.mock("../utils/credentialValidator.js", () => ({
    validateUsernameChoice: vi.fn().mockReturnValue({ valid: true }),
    validatePasswordChoice: vi.fn().mockReturnValue({ valid: true }),
}));

describe("POST /auth/create-user", async () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
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

    it("returns 409 if username already exists", async () => {
        const dupErr = new Error();
        dupErr.code = "ER_DUP_ENTRY";
        db.pool.query.mockRejectedValueOnce(dupErr);

        const res = await request(app)
            .post("/auth/create-user")
            .send({
                username: "existinguser",
                password: "s3crets!",
                confirmPassword: "s3crets!",
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            errorCode: RegistrationErrorCodes.DUPLICATE_USER,
        });
    });

    it("returns 500 and UNKNOWN_ERROR if the DB throws a non-duplicate error", async () => {
        const genericError = new Error("DB failure");
        db.pool.query.mockRejectedValueOnce(genericError);

        const res = await request(app)
            .post("/auth/create-user")
            .send({
                username: "someuser",
                password: "s3crets!",
                confirmPassword: "s3crets!",
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            errorCode: RegistrationErrorCodes.UNKNOWN_ERROR,
        });
    });

    it("returns 400 if password validation fails", async () => {
        const weakCode = RegistrationErrorCodes.PASSWORD_WEAK;

        validatePasswordChoice.mockReturnValueOnce({
            valid: false,
            code: weakCode,
        });

        const res = await request(app)
            .post("/auth/create-user")
            .send({
                username: "newuser",
                password: "weakpass",
                confirmPassword: "weakpass",
            })
            .set("Accept", "application/json");

        expect(validatePasswordChoice).toHaveBeenCalledWith(
            "weakpass",
            "weakpass"
        );

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ errorCode: weakCode });
    });
});

describe("POST /auth/login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns 200 and a token when credentials are valid", async () => {
        const fakeUser = {
            user_id: 42,
            username: "validuser",
            password_hash: "stored-hash",
            is_admin: false,
        };

        db.pool.query.mockResolvedValueOnce([[fakeUser]]);

        bcrypt.compare.mockResolvedValueOnce(true);

        const dummyToken = "signed.jwt.token";
        vi.spyOn(jwt, "sign").mockReturnValueOnce(dummyToken);

        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "validuser",
                password: "userpassword",
            })
            .set("Accept", "application/json");

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(
                /^SELECT \* FROM Users WHERE username = \? LIMIT 1/
            ),
            ["validuser"]
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "userpassword",
            "stored-hash"
        );

        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: fakeUser.user_id,
                username: fakeUser.username,
                isAdmin: fakeUser.is_admin,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "Login successful.",
            token: dummyToken,
        });
    });

    it("returns 401 if the password does not match the username", async () => {
        const fakeUser = {
            user_id: 7,
            username: "user1",
            password_hash: "stored-hash",
            is_admin: false,
        };

        db.pool.query.mockResolvedValueOnce([[fakeUser]]);

        bcrypt.compare.mockResolvedValueOnce(false);

        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "user1",
                password: "wrongpassword",
            })
            .set("Accept", "application/json");

        expect(db.pool.query).toHaveBeenCalledWith(
            expect.stringMatching(
                /^SELECT \* FROM Users WHERE username = \? LIMIT 1/
            ),
            ["user1"]
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "wrongpassword",
            "stored-hash"
        );

        expect(res.status).toBe(401);
    });

    it("returns 500 if the DB query throws", async () => {
        const dbErr = new Error("DB failure");
        db.pool.query.mockRejectedValueOnce(dbErr);

        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "anyuser",
                password: "anypass",
            })
            .set("Accept", "application/json");

        expect(res.status).toBe(500);
    });
});
