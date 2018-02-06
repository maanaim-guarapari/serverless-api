import { Praises } from '../Praises';

export const get = (event, context, cb) => {
  const praises = new Praises();
  praises.find(event, cb);
}
