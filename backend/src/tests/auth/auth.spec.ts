import request from "supertest";
import { app } from "../../app";

describe("Authentication", () => {

    it("should not authenticate with invalid email", async () => {

        const response = await request(app)
            .post("/login")
            .send({
                email: "naoexiste@test.com",
                password: "123456"
            });

        expect(response.status).toBe(401);
    });

});