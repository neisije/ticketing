import { Publisher, Subjects, TicketUpdatedEvent} from '@jk2b/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {

  readonly subject = Subjects.TicketUpdated;

}