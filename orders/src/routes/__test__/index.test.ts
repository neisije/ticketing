import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket =  async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: ticketId.toHexString(),
    title: 'AAA',
    price: 20
  });

  await ticket.save();
  return ticket;
}

it('fetches orders for a specific user', async () => {

  // create 3 tickets
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // Create 1 order as User #1
  await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);

  // Create 2 orders as User #2
  const { body: order2 } = await request(app)
  .post('/api/orders')
  .set('Cookie', user2)
  .send({ticketId: t2.id })
  .expect(201);

  const { body: order3 } = await request(app)
  .post('/api/orders')
  .set('Cookie', user2)
  .send({ticketId: t3.id })
  .expect(201);

  // Make request to get orders for user #2

  const response = await request(app)
  .get('/api/orders')
  .set('Cookie', user2)
  .expect(200);

  // Make sure we only got the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);
  expect(response.body[0].ticket.id).toEqual(t2.id);
  expect(response.body[1].ticket.id).toEqual(t3.id);

});


