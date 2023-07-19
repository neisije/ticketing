// import { Message } from "node-nats-streaming";
// import { Subjects, Listener, TicketCreatedEvent } from "@jk2b/common";
// import { Ticket } from "../../models/ticket";
// import {queueGroupName } from './queue-group-name';

// // export class TicketCreatedListener extends listener<TicketCreatedEvent> {

// //   readonly subject = Subjects.TicketCreated;
// //   queueGroupName = queueGroupName;
// //   async onMessage(data: TicketCreatedEvent['data'],msg: Message) {
// //       const { id, title, price } = data;
// //       const ticket = Ticket.build({
// //         id, title, price
// //       });
// //       await ticket.save();

// //       msg.ack();
// //   }


// // }

// export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
//   readonly subject = Subjects.TicketCreated;
//   queueGroupName = queueGroupName;

//   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
//     const { id, title, price } = data;

//     console.log(`Ticket: id=${id}, title=${title}, price=${price}`);

//     const ticket = Ticket.build({
//       id,
//       title,
//       price,
//     });
//     // await ticket.save();

//     msg.ack();
//   }
// }

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@jk2b/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    console.log(`Ticket: id=${id}, title=${title}, price=${price}`);
    
    msg.ack();
  }
}
