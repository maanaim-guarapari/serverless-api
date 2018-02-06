import { Praises } from '../Praises';

export const deleteMessage = (event, context, cb) => {
  const praises = new Praises();
  praises.delete(event, cb);
}
