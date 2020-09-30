const commonInfo = require('./commonData');
const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);

describe('Registration', () => {
  afterAll(async (done) => {
    done();
  });

  it('should respond with a 422 and an error message', async (done) => {
    const res = await req.post('/api/v1/users/register').send({
      email: 'test@test.com',
      name: 'Test User',
      password: 't',
    });
    expect(res.status).toBe(422);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        {
          value: 't',
          msg: 'Password must be at least 8 characters',
          location: 'body',
          param: 'password',
        },
        {
          value: 't',
          msg: 'Password must include at least one uppercase letter',
          location: 'body',
          param: 'password',
        },
        {
          value: 't',
          msg: 'Password must include at least one number',
          location: 'body',
          param: 'password',
        },
        {
          value: 't',
          msg: 'Password must include at least one special character',
          location: 'body',
          param: 'password',
        },
      ]),
    );
    done();
  });

  it('should respond with a 201 and authenticated message', async (done) => {
    const res = await req.post('/api/v1/users/register').send({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      registered: true,
      users: { email: 'test@test.com' },
    });
    done();
  });

  it('should respond with a 409 and an error if user already exists', async (done) => {
    const res = await req.post('/api/v1/users/register').send({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });
    expect(res.status).toBe(409);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        {
          msg: 'Email already exists',
          location: 'body',
          param: 'email',
        },
      ]),
    );
    done();
  });
});

describe('Login', () => {
  it('should respond with a 401 and an error if the email is incorrect', async (done) => {
    const res = await req.post('/api/v1/auth/login').send({
      email: 'notTest@test.com',
      password: 'Test1234!',
    });
    expect(res.status).toBe(401);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        {
          msg: 'Invalid email or password',
          location: 'body',
        },
      ]),
    );
    done();
  });

  it('should respond with a 401 and an error if the password is incorrect', async (done) => {
    const res = await req.post('/api/v1/auth/login').send({
      email: 'test@test.com',
      password: 'notTest1234!',
    });
    expect(res.status).toBe(401);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        {
          msg: 'Invalid email or password',
          location: 'body',
        },
      ]),
    );
    done();
  });

  it('should respond with a 200 and the access token in the body and refresh token in a cookie', async (done) => {
    const res = await req.post('/api/v1/auth/login').send({
      email: 'test@test.com',
      password: 'Test1234!',
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.header['set-cookie'][0]).toMatch(/jrt/);
    done();
  });
});

describe('Refresh Token', () => {
  it('should respond with a 200 and an updated access/refresh token when given a valid refresh token', async (done) => {
    const res = await req.post('/api/v1/auth/refresh_token');
    expect(res.body.accessToken).toBeDefined();
    expect(res.header['set-cookie'][0]).toMatch(/jrt/);
    commonInfo.accessToken = res.body.accessToken;
    done();
  });
});

describe('Delete user', () => {
  it('should respond with a 200 if the user is deleted.', async (done) => {
    const res = await req
      .delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      deleted: true,
    });
    done();
  });

  it('should respond with a 401 if the user is not logged in.', async (done) => {
    const res = await req.delete('/api/v1/users/delete');
    expect(res.status).toBe(401);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        {
          msg: 'Unauthorized',
        },
      ]),
    );
    done();
  });
});
