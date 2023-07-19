import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@jk2b/common";
import { Ticket } from "../../models/ticket";
import {queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'],msg: Message) {
      const ticket = await Ticket.findByEvent(data);
      const { id, title, price, version } = data;

      if (!ticket) {
        throw new Error(`Ticket not found / Event version mismatch : Event version = ${version}`);
      }

      ticket.set({id, title, price});
      await ticket.save();

      msg.ack();
  }


}