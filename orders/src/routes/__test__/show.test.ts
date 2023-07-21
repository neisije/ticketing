import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket =  async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'BBB',
    price: 20
  });

  await ticket.save();
  return ticket;
}

it('shows a specific order owned by me', async () => {

  const t1 = await buildTicket();
  const user1 = global.signin();

  const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);


  const {body: fetchedOrder } = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', user1)
  .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
})

it('does not show an order not owned by me', async () => {

  const t1 = await buildTicket();
  const user1 = global.signin();

  const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);


  await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', global.signin())
  .expect(401);

})