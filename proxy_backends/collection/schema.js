import { Proxies } from '/proxies/collection';
import { ProxyBackends } from './';
import { ApiUmbrellaSchema } from './apiUmbrellaSchema';

ProxyBackends.schema = new SimpleSchema({
  proxyId: {
    type: String,
    optional: true,
    autoform: {
      options: function () {
        return _.map(Proxies.find().fetch(), function (proxy) {
          return {
            label: proxy.name,
            value: proxy._id,
          };
        });
      },
    },
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
