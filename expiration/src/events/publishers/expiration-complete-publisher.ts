import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jk2b/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
