import request from "supertest";
import { app } from "../../app";

describe("Register", () => {

    it("should create a client", async () => {

        const response = await request(app)
            .post("/users")
            .send({
                name: "Leonardo",
                email: `leo_${Date.now()}@test.com`,
                password: "123456"
            });

        expect(response.status).toBe(201);

        expect(response.body.message)
            .toBe("Cliente cadastrado com sucesso.");
    });

    it("should not create duplicated email", async () => {

        const email = `leo_${Date.now()}@test.com`;

        await request(app)
            .post("/users")
            .send({
                name: "Leonardo",
                email,
                password: "123456"
            });

        const response = await request(app)
            .post("/users")
            .send({
                name: "Leonardo",
                email,
                password: "123456"
            });

        expect(response.status).toBe(400);
    });

});