import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = async () => {
  return request(app)
  .post('/api/tickets')
  .set("Cookie", global.signin())
  .send({
    title: 'Ticket',
    price: 1
  })
  .expect(201);
}

it('return a 404 if the ticket does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/ticket/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'Ticket',
    price: 1
  })
  .expect(404);
});

it('return a 401 if user is not signed in', async () => {
  await request(app).put('/api/ticket/012345678901')
  .send({    
    title: 'Ticket',
    price: 2
  }).expect(401);
});

it('return a 401 if user does not own the ticket', async () => {
  const ticket = await createTicket();
  const id = ticket.body.id;

  await request(app).put(`/api/ticket/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'Updated Ticket',
    price: 3  
  }).expect(401);

  const ticketUpdated = await request(app)
  .get(`/api/ticket/${id}`)
  .send()
  .expect(200);

  expect(ticketUpdated.body.title).toEqual(ticket.body.title);
  expect(ticketUpdated.body.price).toEqual(ticket.body.price);
  
});


it('returns an error if an invalid title or price are provided', async () => {
  const cookie = global.signin();

  const ticket = await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: 'Ticket',
    price: 1
  })
  .expect(201);

  const id = ticket.body.id;


  await request(app)
  .put(`/api/ticket/${id}`)
  .set("Cookie", cookie)
  .send({
    title: '',
    price: 5
  })
  .expect(400);

  await request(app)
  .put(`/api/ticket/${id}`)
  .set("Cookie", cookie)
  .send({
    price: 6
  })
  .expect(400);

  await request(app)
  .put(`/api/ticket/${id}`)
  .set("Cookie", cookie)
  .send({
    title: 'Ticket',
    price: -1
  })
  .expect(400);

  await request(app)
  .put(`/api/ticket/${id}`)
  .set("Cookie", cookie)
  .send({
    title: 'Ticket'
  })
  .expect(400);
});



it('return a 201 if parameters are valid', async () => {
  const cookie = global.signin();

  const ticket = await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: 'Ticket',
    price: 1
  })
  .expect(201);
  
  const id = ticket.body.id;

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  const updatedTicket = await request(app).put(`/api/ticket/${id}`)
  .set('Cookie', cookie)
  .send({
    title: 'Title updated',
    price: 4
  })
  .expect(200);

  expect(updatedTicket.body.title).toEqual('Title updated');
  expect(updatedTicket.body.price).toEqual(4);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  const ticketResponse = await request(app)
  .get(`/api/ticket/${id}`)
  .send()
  .expect(200);

  expect(ticketResponse.body.title).toEqual(updatedTicket.body.title);
  expect(ticketResponse.body.price).toEqual(updatedTicket.body.price);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const ticket = await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: 'Ticket',
    price: 1
  })
  .expect(201);
  
  const id = ticket.body.id;

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  const updatedTicket = await request(app).put(`/api/ticket/${id}`)
  .set('Cookie', cookie)
  .send({
    title: 'Title updated',
    price: 4
  })
  .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});