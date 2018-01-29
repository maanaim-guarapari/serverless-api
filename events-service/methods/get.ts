import { Events } from '../Events';

export const get = (event, context, cb) => {
  const events = new Events();
  events.find(event, cb);
}
