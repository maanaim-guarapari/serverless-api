import { Config } from '../Config';

export const handler = (event, context, cb) => {
  const config = new Config();
  config.setConfigValue(event, cb);
}
