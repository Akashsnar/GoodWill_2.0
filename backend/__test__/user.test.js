const request = require("supertest")

const baseURL = "http://localhost:4000/";

describe('POST /api/users/login', () => {
    it('should return 200 OK and a token if login is successful', async () => {
        const response = await request(baseURL)
            .post('api/users/login')
            .send({ mode: "User", email: 'dj@gmail.com', password: 'dhruv@12' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
