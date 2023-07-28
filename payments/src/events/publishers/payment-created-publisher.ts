import { Publisher, PaymentCreatedEvent, Subjects } from '@jk2b/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  // subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  readonly subject =  Subjects.PaymentCreated;
}
