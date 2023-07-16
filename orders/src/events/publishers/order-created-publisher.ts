import { Publisher, Subjects, OrderCreatedEvent} from '@jk2b/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {

  readonly subject = Subjects.OrderCreated;

}