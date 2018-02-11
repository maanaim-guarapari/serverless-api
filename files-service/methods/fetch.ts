
import { File } from '../File';

export const handler = (event, context, cb) => {
  const file = new File();
  file.fetch(event, cb);
}
