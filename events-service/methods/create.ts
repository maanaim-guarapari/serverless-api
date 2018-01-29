import { Events } from '../Events';

export const create = (event, context, cb) => {
  const events = new Events();
  events.create(event, cb);
}
