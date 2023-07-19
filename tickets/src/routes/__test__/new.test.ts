import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('works if user is signed in', async () => {
  const response = await request(app).post('/api/tickets')
  .set('Cookie', global.signin())
  .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    id: ticketId.toHexString(),
    title: '',
    price: 10
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    price: 10
  })
  .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    id: 'flksjlksjfl',
    title: 'This is a title',
    price: -1
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    title: 'This is a title'
  })
  .expect(400);

});

it('it creates a ticket with valid parameters', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'This is a valid title';
  const ticket = {
    id: 'llkjlkjlkjlk',
    title: title,
    price: 1
  }

  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send(ticket)
  .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(1);

});

it('publishes an event', async () => {
  const title = 'This is a valid title';
  const ticket = {
    id: 'kljlkjlkjlk',
    title: title,
    price: 1
  }

  await request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send(ticket)
  .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});