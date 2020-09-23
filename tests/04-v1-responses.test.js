const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');
const hashIds = require('../helpers/hashIds');

describe('Responses', () => {
  beforeAll(async (done) => {
    await req.post('/api/v1/users/register').send({
      email: 'test2@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });

    const res = await req.post('/api/v1/auth/login').send({
      email: 'test2@test.com',
      password: 'Test1234!',
    });
    commonInfo.accessToken = res.body.accessToken;

    const survey = await req
      .post('/api/v1/surveys/new')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
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
    commonInfo.firstSurvey = survey.body;
    done();
  });

  afterAll(async (done) => {
    await req
      .delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
    done();
  });

  describe('New Response', () => {
    it('should respond with a 200 and create a response for a given survey', async (done) => {
      const responses = commonInfo.firstSurvey.result.questions.map(
        (question, i) => ({
          value: `Response to question ${i + 1}`,
          respondent: 'Greg',
          questionId: question.id,
        }),
      );
      const res = await req.post('/api/v1/responses/new').send({
        responses,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBeTruthy();
      commonInfo.firstResponse = res.body.results[0];
      done();
    });
  });

  describe('Get Responses', () => {
    it('should respond with a 200 and all the responses for a given survey', async (done) => {
      const res = await req
        .get(
          `/api/v1/responses/${hashIds.encode(
            commonInfo.firstSurvey.result.id,
          )}`,
        )
        .set('Authorization', `Bearer ${commonInfo.accessToken}`);
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBeTruthy();
      expect(res.body.results.length).toBeGreaterThan(0);
      done();
    });

    it('should respond with a 404 if the survey does not exist', async (done) => {
      const res = await req
        .get(`/api/v1/responses/doesNotExist`)
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
        `/api/v1/responses/${commonInfo.firstSurvey.id}`,
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

  describe('Delete response', () => {
    it('should respond with a 200 if the response is deleted.', async (done) => {
      const res = await req
        .delete('/api/v1/responses/delete')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .send({ responseId: commonInfo.firstResponse.id });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        deleted: true,
      });
      done();
    });

    it('should respond with a 401 if the user is not logged in.', async (done) => {
      const res = await req
        .delete('/api/v1/responses/delete')
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
