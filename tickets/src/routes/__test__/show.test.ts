import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('Get ticket details of a valid userId', async () => {

  const title = 'This is a valid title';
  const price = 10;
  const ticket = {
    title: title,
    price: price
  }

  const response = await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send(ticket)
  .expect(201);

  const userId = response.body.id;

  const userTicket = await request(app)
  .get(`/api/ticket/${userId}`)
  .send()
  .expect(200);

  expect(userTicket.body.title).toEqual(title);
  expect(userTicket.body.price).toEqual(price);

});

it('Get ticket details of a invalid userId must return 404', async () => {
  // id passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
  .get(`/api/ticket/${id}`)
  .send()
  .expect(404);


});