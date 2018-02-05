import { Praises } from '../Praises';

export const list = (event, context, cb) => {
  const praises = new Praises();
  events.fetchAll(event, cb);
}
