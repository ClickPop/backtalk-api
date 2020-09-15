const supertest = require('supertest');
const app = require('../app');
const req = supertest(app);
describe('Initial Endpoint', () => {
  it('should respond at api root', async (done) => {
    const res = await req.get('/');
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('Welcome to this survey app!');
    done();
  });
});
