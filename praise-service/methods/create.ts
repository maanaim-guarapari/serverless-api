import { Praises } from '../Praises';

export const create = (event, context, cb) => {
  const praises = new Praises();
  praises.create(event, cb);
}
