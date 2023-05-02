import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on successful signin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(200)
});

it('returns a 400 when signin with wrong password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zery'
  })
  .expect(400)
});

it('returns a 400 when signin with a wrong email', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'xyz@test.com',
    password: 'q01234aA,zerty'
  })

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zery'
  })
  .expect(400)
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'testtest.com',
    password: 'q01234aA,zerty'
  })
  .expect(400)
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'testtest.com',
    password: 'qty'
  })
  .expect(400)
});

it('sets a cookie after successful signin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(200)
  
  expect (response.get('Set-Cookie')).toBeDefined();
  
});