import nats from 'node-nats-streaming';
import { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions()
  .setManualAckMode(true)
  .setDeliverAllAvailable()
  .setDurableName('ticket_created');

  const subscription = stan.subscribe('ticket:created', 'queue-group-2', options);
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof(data) === 'string') {
      console.log(`Received message N° ${msg.getSequence()} : ${data}`);
    }
    msg.ack();
    
  });
});


process.on('SIGINT', () => {
  stan.close();
});

process.on('SIGTERM', () => {
  stan.close();
});