import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(201)
});

it('returns a 400 on email already in-use during signup', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(201)

  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(400)
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'testtest.com',
    password: 'q01234aA,zerty'
  })
  .expect(400)
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'testtest.com',
    password: 'qty'
  })
  .expect(400)
});

it('returns a 400 with an empty password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(201)
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(201);
  
  expect (response.get('Set-Cookie')).toBeDefined();
  
});
