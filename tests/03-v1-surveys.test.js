const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');

describe('Create Survey', () => {
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

  it('should respond with a subset of surveys with a query parameter', async (done) => {
    const res = await req
      .get('/api/v1/surveys?count=10')
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
    expect(res.body.results).toBeDefined();
    expect(Array.isArray(res.body.results)).toBeTruthy();
    expect(res.body.results).toHaveLength(10);
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
