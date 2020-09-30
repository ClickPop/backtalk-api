const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');
commonInfo.req = req;
describe('Initial Endpoint', () => {
  afterAll(async (done) => {
    done();
  });

  it('should respond at api root', async (done) => {
    const res = await req.get('/');
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('Welcome to this survey app!');
    done();
  });
});
