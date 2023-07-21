import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from "mongoose";
import { natsWrapper } from '../../nats-wrapper';

const buildTicket =  async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'BBB',
    price: 20
  });

  await ticket.save();
  return ticket;
}

it('marks an order as cancelled to delete an order', async () => {

  // create 1 ticket
  const t1 = await buildTicket();
  const user1 = global.signin();

  // Create 1 order as User #1
  const { body: order } = await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);

  await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', user1)
  .send()
  .expect(204);

  const deletedOrder = await Order.findById(order.id);
  expect(deletedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('does not delete an order not owned by me', async () => {

  const t1 = await buildTicket();
  const user1 = global.signin();

  const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);


  await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', global.signin())
  .expect(401);

})

it("returns an error if the order does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
});


it("Emits an order Cancelled event", async () => {

  // create 1 ticket
  const t1 = await buildTicket();
  const user1 = global.signin();

  // Create 1 order as User #1
  const { body: order } = await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: t1.id })
  .expect(201);

  await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', user1)
  .send()
  .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});