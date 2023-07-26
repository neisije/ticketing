import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from "@jk2b/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data:OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.AwaitingPayment,
    userId: 'jkjk',
    expiresAt: 'jkljk',
    ticket: {
        id: 'Concert',
        price: 10
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg};
}

it('replicates an order to Payments service', async () => {
  const { listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);

});

it('acks the message', async () => {
  const { listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

})