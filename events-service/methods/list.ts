import { Events } from '../Events';

export const list = (event, context, cb) => {
  const events = new Events();
  events.fetchAll(event, cb);
}
