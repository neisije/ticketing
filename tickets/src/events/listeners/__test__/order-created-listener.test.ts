import { OrderCreatedListener } from "../order-created-listener" ;
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent , OrderStatus} from '@jk2b/common';
import mongoose  from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from "../../../../../orders/src/models/order";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a ticket and save it
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'jk2b',
  });
  await ticket.save();

  // Create the fake data objet
  const data:OrderCreatedEvent['data'] = {
    id : new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: ticket.userId,
    expiresAt: 'a date',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    }
   }; 

   // @ts-ignore
   const msg: Message = {
    ack: jest.fn()
   }

   return { listener, data, ticket, msg};

}


it('sets the orderId of a ticket', async () => {

  const { listener, data, ticket, msg} = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});


it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});