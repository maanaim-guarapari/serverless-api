import { Praises } from '../Praises';

export const list = (event, context, cb) => {
  const praises = new Praises();
  praises.fetchAll(event, cb);
}
