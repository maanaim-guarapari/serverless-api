import { Events } from '../Events';

export const handler = (event, context, cb) => {
  const events = new Events();
  events.delete(event, cb);
}
