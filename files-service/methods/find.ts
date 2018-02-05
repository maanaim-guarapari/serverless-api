
import { File } from '../File';

export const handler = (event, context, cb) => {
  const file = new File();
  file.find(event, cb);
}
