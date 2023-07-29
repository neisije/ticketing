import { Message } from 'node-nats-streaming';
import { Listener, OrderStatus, OrderUpdatedEvent, Subjects } from '@jk2b/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderUpdatedEvent['data'], msg: Message) {
    const orderId = data.id;
    const orderStatus = data.status;

    if (orderStatus == OrderStatus.Complete) {
      const ticket = await Ticket.findOne({
        orderId : orderId,
      });

      if (!ticket) {
        throw new Error(`No ticket found with order ID ${orderId}`);
      };

      const ticketTitle = ticket.title;
      ticket.set({
        title: ticketTitle+" - Solded"
      })

      await ticket.save();
      console.log(`Ticket ${ticket.id} sold !`);

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });
    }

    // ack the message
    msg.ack();
  }
}
