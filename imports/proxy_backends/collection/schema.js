/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Proxies from '/packages/proxies/collection';

// import ApiUmbrellaSchema from './apiUmbrellaSchema';
import ProxyBackends from './';

import registeredProxies from '../../proxies/collection/registered_proxies';

const schema = {
  proxyId: {
    type: String,
    optional: true,
    autoform: {
      options () {
        // Sort proxies by name
        return _.map(Proxies.find({}, { sort: { name: 1 } }).fetch(), (proxy) => {
          return {
            label: proxy.name,
            value: proxy._id,
          };
        });
      },
    },
  },
  apiId: {
    type: String,
  },
  type: {
    type: String,
    optional: false,
  },
};

_.forEach(registeredProxies, (proxyName) => {
  /* eslint-disable global-require */
  // Import proxy schema
  const proxySchema = require(`./schemas/${_.snakeCase(proxyName)}`).default;

  // Add available schemas of proxies to proxy backends schema
  schema[proxyName] = {
    type: proxySchema,
    optional: true,
  };
});

ProxyBackends.schema = new SimpleSchema(schema);

// Internationalize schema texts
ProxyBackends.schema.i18n('schemas.proxyBackends');

// Attach schema to collection
ProxyBackends.attachSchema(ProxyBackends.schema);
