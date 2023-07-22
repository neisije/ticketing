import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@jk2b/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

// import { natsWrapper } from '../../nats-wrapper';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    await expirationQueue.add({ 
      orderId: data.id
    },{
      delay: 10000
    });

    // ack the message
    msg.ack();
  }
}
