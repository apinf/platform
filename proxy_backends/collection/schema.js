/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Proxies from '/proxies/collection';
import ApiUmbrellaSchema from './apiUmbrellaSchema';
import ProxyBackends from './';

ProxyBackends.schema = new SimpleSchema({
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
  apiUmbrella: {
    type: ApiUmbrellaSchema,
    optional: true,
  },
});

// Internationalize schema texts
ProxyBackends.schema.i18n('schemas.proxyBackends');

// Attach schema to collection
ProxyBackends.attachSchema(ProxyBackends.schema);
