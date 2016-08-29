import { ApiKeys } from './';

ApiKeys.schema = new SimpleSchema({
  key: {
    type: String,
    optional: false
  },
  userId: {
    type: String,
    optional: false
  },
  proxyId: {
    type: String,
    optional: false
  }
});
