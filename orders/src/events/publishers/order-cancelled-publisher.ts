import { Subjects, Publisher, OrderCancelledEvent } from '@jk2b/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
