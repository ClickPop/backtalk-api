const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');
const uaString =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36';
commonInfo.req = req;
describe('Initial Endpoint', () => {
  afterAll(async (done) => {
    done();
  });

  it('should respond at api root', async (done) => {
    const res = await req.get('/').set('User-Agent', uaString);
    expect(res.status).toBe(200);
    expect(res.body.data).toBe('Welcome to this survey app!');
    done();
  });
});
