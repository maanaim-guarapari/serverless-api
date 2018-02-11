import { Praises } from '../Praises';

export const handler = (event, context, cb) => {
  const praises = new Praises();
  praises.fetch(event, cb);
}
