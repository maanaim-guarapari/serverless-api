import { Praises } from '../Praises';

export const deleteMessage = (event, context, cb) => {
  const praises = new Praises();
  events.delete(event, cb);
}
