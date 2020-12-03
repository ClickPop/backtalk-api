const supertest = require('supertest');
const app = require('../server/app');
const req = supertest.agent(app);
const commonInfo = {};
const uaString =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36';

describe('/admin', () => {
  beforeAll(async (done) => {
    await req.post('/api/v1/users/register').set('User-Agent', uaString).send({
      email: 'test3@test.com',
      name: 'Test User',
      password: 'Test1234!',
    });

    const res = await req
      .post('/api/v1/auth/login')
      .set('User-Agent', uaString)
      .send({
        email: 'test3@test.com',
        password: 'Test1234!',
      });
    commonInfo.accessToken = res.body.accessToken;

    const survey = await req
      .post('/api/v1/surveys/new')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .set('User-Agent', uaString)
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

    await req
      .get('/api/v1/admin/admin')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .set('User-Agent', uaString);
    done();
  });

  afterAll(async (done) => {
    await req
      .delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${commonInfo.accessToken}`)
      .set('User-Agent', uaString);
    done();
  });

  describe('GET Users', () => {
    it('should return all people if you are an admin', async (done) => {
      const res = await req
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .set('User-Agent', uaString);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBe(true);
      res.body.results.forEach((user) => {
        expect(user).toHaveProperty('Surveys');
        user.Surveys.forEach((survey) => {
          expect(survey).toHaveProperty('Questions');
          expect(survey).toHaveProperty('Responses');
        });
      });
      done();
    });
  });

  describe('GET Surveys', () => {
    it('should return all people if you are an admin', async (done) => {
      const res = await req
        .get('/api/v1/admin/surveys')
        .set('Authorization', `Bearer ${commonInfo.accessToken}`)
        .set('User-Agent', uaString);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBe(true);
      res.body.results.forEach((survey) => {
        expect(survey).toHaveProperty('Questions');
        expect(survey).toHaveProperty('Responses');
        expect(survey).toHaveProperty('User');
      });
      done();
    });
  });
});
