import { OrderCancelledListener } from "../order-cancelled-listener" ;
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent , OrderStatus} from '@jk2b/common';
import mongoose  from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create a ticket and save it
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'jk2b',
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({orderId:orderId});

  await ticket.save();

  // Create the fake data objet
  const data:OrderCancelledEvent['data'] = {
    id : orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
   }; 

   // @ts-ignore
   const msg: Message = {
    ack: jest.fn()
   }

   return { listener, data, ticket, orderId, msg};

}


it('Unsets the orderId of a ticket', async () => {

  const { listener, data, ticket, orderId, msg} = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});


it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, ticket, msg} = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // get the 2nd argument passed to publish()
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  console.log(ticket);
  console.log(data);
  console.log(ticketUpdatedData);

  expect(ticket.id).toEqual(ticketUpdatedData.id);
  expect(ticketUpdatedData!.orderId).not.toBeDefined();


});