import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { Subjects } from './events/subjects';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex') , {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20.99,
      userId: 12345
    });
  } catch (err) {
    console.error(err);
  }

});

process.on('SIGINT', () => {
  stan.close();
});

process.on('SIGTERM', () => {
  stan.close();
});