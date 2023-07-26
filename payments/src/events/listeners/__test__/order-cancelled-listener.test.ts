import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from "@jk2b/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    status: OrderStatus.Created,
    userId: 'jlkjlkj',
    version: 0,
    price: 10
  });
  await order.save();

  // Create the fake data objet
  const data:OrderCancelledEvent['data'] = {
    id : orderId,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    }
   }; 

   // @ts-ignore
   const msg: Message = {
    ack: jest.fn()
   }

   return { listener, data, msg, order};
}

it('updates the status of an order', async () => {
  const { listener, data, msg, order} = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('acks the message', async () => {
  const { listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

})