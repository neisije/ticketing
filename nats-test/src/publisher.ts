import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex') , {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('publisher connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });
  
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 10,
  });

  stan.publish('ticket:created', data, () => {
    console.log('event published');
  })
});

process.on('SIGINT', () => {
  stan.close();
});

process.on('SIGTERM', () => {
  stan.close();
});