import { Publisher, PaymentCreatedEvent, Subjects } from '@jk2b/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject =  Subjects.PaymentCreated;
}
