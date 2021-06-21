import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@amttickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
