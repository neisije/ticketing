import request from 'supertest';
import { app } from '../../app';

it('response with details about currentuser', async () => {
  const authResp = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'q01234aA,zerty'
  })
  .expect(201);

  const cookie = authResp.get('Set-Cookie');

  const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie)
  .send({})
  .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');

});