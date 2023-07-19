// import { Publisher, Subjects, OrderCreatedEvent} from '@jk2b/common';

// export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {

//   readonly subject = Subjects.OrderCreated;

// }

import { Publisher, OrderCreatedEvent, Subjects } from '@jk2b/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
