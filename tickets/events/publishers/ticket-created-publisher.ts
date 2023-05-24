import { Publisher, Subjects, TicketCreatedEvent} from '@jk2b/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {

  readonly subject = Subjects.TicketCreated;

}