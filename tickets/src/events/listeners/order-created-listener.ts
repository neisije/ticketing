import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@jk2b/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../../../orders/src/models/order';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket throw an error
    if ( ! ticket ) {
      throw new Error('Ticket not found');
    }

    // mark the ticket as reserved by setting its orderid property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
