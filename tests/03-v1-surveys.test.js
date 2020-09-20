const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');
const HashIds = require('hashids/cjs');
const { encode } = new HashIds(process.env.HASH_SECRET);

describe('Surveys', () => {
  beforeAll(async () => {
    await req.post('/api/v1/users/register').send({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });
    const res = await req.post('/api/v1/auth/login').send({
      email: 'test@test.com',
      password: 'Test1234!',
    });
    commonInfo.accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await req
      .delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
  });

  describe('New Survey', () => {
    it('should respond with a 200 and create a survey with the given information', async (done) => {
      const res = await req
        .post('/api/v1/surveys/new')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .send({
          title: 'Test Title',
          description: 'This is a test description',
          questions: [
            {
              prompt: 'This is question 1 prompt',
              description: 'This is question 1 description',
              type: 'text',
            },
            {
              prompt: 'This is question 2 prompt',
              description: 'This is question 2 description',
              type: 'text',
            },
          ],
        });
      expect(res.status).toBe(200);
      expect(res.body.result.title).toBe('Test Title');
      expect(res.body.result.description).toBe('This is a test description');
      expect(res.body.result.questions).toHaveLength(2);
      res.body.result.questions.forEach((question) => {
        expect(question).toHaveProperty('prompt');
        expect(question).toHaveProperty('description');
        expect(question).toHaveProperty('type');
      });
      done();
    });

    it('should respond with a 401 if the user is not logged in.', async (done) => {
      const res = await req.post('/api/v1/surveys/new').send({
        title: 'Test Title',
        description: 'This is a test description',
        questions: [
          {
            prompt: 'This is question 1 prompt',
            description: 'This is question 1 description',
            type: 'text',
          },
          {
            prompt: 'This is question 2 prompt',
            description: 'This is question 2 description',
            type: 'text',
          },
        ],
      });
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

  describe('Get Surveys', () => {
    it('should respond with a 200 and all the surveys for a given user with a max of 20.', async (done) => {
      const res = await req
        .get('/api/v1/surveys')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBeTruthy();
      expect(res.body.results.length).toBeGreaterThan(0);
      done();
    });

    it('should respond with a subset of surveys with the count query parameter', async (done) => {
      const res = await req
        .get('/api/v1/surveys?count=1')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBeTruthy();
      expect(res.body.results).toHaveLength(1);
      commonInfo.firstSurvey = res.body.results[0];
      done();
    });

    it('should respond with a subset of surveys with the count and skip some using the offset query parameters', async (done) => {
      const res = await req
        .get('/api/v1/surveys?count=1&offset=1')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBeTruthy();
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]).not.toEqual(commonInfo.firstSurvey);
      done();
    });

    it('should respond with a 401 if the user is not logged in.', async (done) => {
      const res = await req.get('/api/v1/surveys');
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

  describe('Get Specific Survey', () => {
    it('should respond with a 200 and a specific survey', async (done) => {
      const res = await req
        .get(`/api/v1/surveys/${encode(commonInfo.firstSurvey.id)}`)
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.result.title).toBe('Test Title');
      expect(res.body.result.description).toBe('This is a test description');
      expect(res.body.result.questions).toHaveLength(2);
      res.body.result.questions.forEach((question) => {
        expect(question).toHaveProperty('prompt');
        expect(question).toHaveProperty('description');
        expect(question).toHaveProperty('type');
      });
      done();
    });

    it("should respond with a 404 and an error if the survey doesn't exist", async (done) => {
      const res = await req
        .get(`/api/v1/surveys/doesNotExist`)
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.status).toBe(404);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          {
            msg: 'Not Found',
            location: 'url',
          },
        ]),
      );
      done();
    });

    it('should respond with a 401 if the user is not logged in.', async (done) => {
      const res = await req.get(
        `/api/v1/surveys/${encode(commonInfo.firstSurvey.id)}`,
      );
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

  describe('Delete survey', () => {
    it('should respond with a 200 if the survey is deleted.', async (done) => {
      const res = await req
        .delete('/api/v1/surveys/delete')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .send({ surveyId: 0 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        deleted: true,
      });
      done();
    });

    it('should respond with a 401 if the user is not logged in.', async (done) => {
      const res = await req
        .delete('/api/v1/surveys/delete')
        .send({ surveyId: 0 });
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
});
