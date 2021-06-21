import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test100@test101.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when a email that does not exist is supplied', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test11@test11.com',
    password: 'password',
  });

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test11@test11.com',
      password: 'password1',
    })
    .expect(400);
});

it('fails when a email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test100@test101.com',
      password: 'password',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test11@test11.com',
    password: 'password',
  });

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test11@test11.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
