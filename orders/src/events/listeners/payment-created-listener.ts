// import { Message } from 'node-nats-streaming';
// import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@jk2b/common';
// import { Order } from '../../models/order';
// import { queueGroupName } from './queue-group-name';
// import { OrderUpdatedPublisher } from '../publishers/order-updated-publisher';
// import { natsWrapper } from '../../nats-wrapper';

// export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
//   readonly subject = Subjects.PaymentCreated;
//   queueGroupName = queueGroupName;

//   async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
//     const { orderId } = data;

//     const order = await Order.findById({orderId});

//     if (! order ) {
//       throw new Error('Order not found');
//     }

//     order.set({
//       status: OrderStatus.Complete
//     })
//     await order.save();

//     // new OrderUpdatedPublisher(natsWrapper.client).publish({
//     //   id: order.id,
//     //   status: order.status,
//     //   version: order.version
//     // });

//     msg.ack();
//   }
// }

import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@jk2b/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
