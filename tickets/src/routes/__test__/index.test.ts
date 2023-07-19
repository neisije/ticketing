import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = async () => {

  const ticketId = new mongoose.Types.ObjectId();

  return await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    id: ticketId.toHexString(),
    title: 'Ticket',
    price: 1
  })
  .expect(201);
}

it('get all tickets must return 200', async () => {

  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
  .get('/api/tickets')
  .send()
  .expect(200);

  expect(response.body.length).toEqual(3);

});
