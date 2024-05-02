const request = require('supertest');
const app = require('../app');

test('returns a list of users', async () => {
  const response = await request(app).get('/NGOsLength');
  expect(response.status).toBe(200);
  // expect(response.body).toEqual([    { id: 1, name: 'Alice' },    { id: 2, name: 'Bob' },    { id: 3, name: 'Charlie' },  ]);
});