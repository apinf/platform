import { ProxyBackends } from './';
import { ApiUmbrellaSchema } from './apiUmbrellaSchema';

ProxyBackends.schema = new SimpleSchema({
  "proxyId": {
    type: String
  },
  "apiUmbrella": {
    type: ApiUmbrellaSchema,
    optional: true
  }
});

ProxyBackends.attachSchema(ProxyBackends.schema);
