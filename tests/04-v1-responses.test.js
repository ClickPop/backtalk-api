const supertest = require('supertest');
const app = require('../app');
const req = supertest.agent(app);
const commonInfo = require('./commonData');
const HashIds = require('hashids/cjs');
const { encode } = new HashIds(process.env.HASH_SECRET);

describe('New Response', () => {
  it('should respond with a 200 and create a response for a given survey', async (done) => {
    const res = await req.post('api/v1/responses/new').send({
      survey: commonInfo.firstSurvey.id,
      responses: commonInfo.firstSurvey.questions.map((question, i) => ({
        value: `Response to question ${i + 1}`,
        respondent: 'Greg',
        questionId: question.id,
      })),
    });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeDefined();
    expect(res.body.result).toHaveProperty('responses');
    expect(Array.isArray(res.body.result.responses)).toBeTruthy();
    done();
  });
});

describe('Get Responses', () => {
  it('should respond with a 200 and all the responses for a given survey', async (done) => {
    const res = await req
      .get(`/api/v1/response/${encode(commonInfo.firstSurvey.id)}`)
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBeTruthy();
    expect(res.body.results.length).toBeGreaterThan(0);
    done();
  });

  it('should respond with a 404 if the survey does not exist', async (done) => {
    const res = await req
      .get(`/api/v1/response/doesNotExist`)
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
    const res = await req.get(`/api/v1/responses/${commonInfo.firstSurvey.id}`);
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
      .set('Authorization', `Bearer ${commonInfo.accessToken}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({
      deleted: true,
    });
    done();
  });

  it('should respond with a 401 if the user is not logged in.', async (done) => {
    const res = await req.deleted('/api/v1/responses/delete');
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
