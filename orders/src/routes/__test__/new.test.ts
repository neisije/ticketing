import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from "mongoose";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
        ticketId
      })
      .expect(404);
});


it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "AC/DC",
    price: 10
  });
  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15);

  const order = Order.build({ 
    userId: 'rrr',
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({
    ticketId: ticket.id
  })
  .expect(400);

});


it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  });
  await ticket.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({
    ticketId: ticket.id
  })
  .expect(201);

  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('Concert');
  expect(tickets[0].price).toEqual(20);

  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Created);
});


it.todo("Emits an order created event");