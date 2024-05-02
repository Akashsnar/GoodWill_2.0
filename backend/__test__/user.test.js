const request = require('supertest');
const app = require('../app');

test('returns a list of users', async () => {
  const response = await request(app).get('/NGOsLength');
  expect(response.status).toBe(200);
  // expect(response.body).toEqual([    { id: 1, name: 'Alice' },    { id: 2, name: 'Bob' },    { id: 3, name: 'Charlie' },  ]);
});


// test('returns a list of users', async () => {
//   const response = await request(app).get('/sitedata/userlength');
//   expect(response.status).toBe(200);
//   expect(response.body ? response.body.length : 0).toBeGreaterThan(10);
// });