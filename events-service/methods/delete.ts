import { Events } from '../Events';

export const deleteMessage = (event, context, cb) => {
  const events = new Events();
  events.delete(event, cb);
}
