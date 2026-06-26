import request from "supertest";
import { app } from "../../app";

describe("JWT", () => {

    it("should return 401 when token is missing", async () => {

        const response = await request(app)
            .get("/tickets");

        expect(response.status).toBe(401);
    });

});