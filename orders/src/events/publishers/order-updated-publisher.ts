import { Publisher, OrderUpdatedEvent, Subjects } from '@jk2b/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}