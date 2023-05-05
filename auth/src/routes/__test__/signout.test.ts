import request from 'supertest';
import { app } from '../../app';


it('reset cookie after successful signout', async () => {
  const cookie = await signin();

  const response = await request(app)
  .post('/api/users/signout')
  .send({})
  .expect(200);
  
  expect (response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');  
});