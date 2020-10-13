const commonInfo = require('./commonData');
const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);

describe('Question', () => {
  beforeAll(async (done) => {
    await req.post('/api/v1/users/register').send({
      email: 'test1@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });

    const res = await req.post('/api/v1/auth/login').send({
      email: 'test1@test.com',
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

  describe('New Question', () => {
    it('should respond with a 200 and create a survey with the given information', async (done) => {
      const res = await req
        .post('/api/v1/question')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .send({
          questions: [
            {
              surveyId: commonInfo.firstSurvey.result.id,
              question: {
                prompt: 'This is question 1 prompt again',
                type: 'text',
              },
            },
            {
              surveyId: commonInfo.firstSurvey.result.id,
              question: {
                prompt: 'This is question 2 prompt again',
                type: 'text',
              },
            },
          ],
        });
      expect(res.status).toBe(201);
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results).toHaveLength(2);
      res.body.results.forEach((result) => {
        expect(result).toHaveProperty('surveyId');
        expect(result.surveyId).toEqual(commonInfo.firstSurvey.result.id);
        expect(result).toHaveProperty('question');
        expect(result.question).toHaveProperty('id');
        expect(result.question).toHaveProperty('prompt');
        expect(result.question).toHaveProperty('type');
        expect(result.question.type).toBe('text');
      });
      done();
    });
  });
});
