import { Message } from 'node-nats-streaming';
import { listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketClassListener extends listener<TicketCreatedEvent> {

  // subject : Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;

  queueGroupName: string = 'payment-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data : ', msg.getSequence(), data);
    msg.ack();
  }
}