import { ProxyBackends } from './';
import { ApiUmbrellaSchema } from './apiUmbrellaSchema';

ProxyBackends.schema = new SimpleSchema({
  'proxyId': {
    type: String,
  },
  'apiId': {
    type: String,
  },
  'apiUmbrella': {
    type: ApiUmbrellaSchema,
    optional: true,
  },
});

// Internationalize schema texts
ProxyBackends.schema.i18n('schemas.ProxyBackends');

// Attach schema to collection
ProxyBackends.attachSchema(ProxyBackends.schema);
