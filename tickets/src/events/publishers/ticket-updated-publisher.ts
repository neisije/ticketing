import { Publisher, Subjects, TicketUpdatedEvent} from '@jk2b/common';
import { natsWrapper } from '../../nats-wrapper';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {

  readonly subject = Subjects.TicketUpdated;

}

