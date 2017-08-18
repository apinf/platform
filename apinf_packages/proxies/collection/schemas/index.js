/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Proxies from '../';

// APInf imports
import registeredProxies from '../registered_proxies';

let schema = {
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    autoform: {
      rows: 5,
    },
  },
  type: {
    type: String,
    allowedValues: registeredProxies,
  },
};

// Iterate through registered proxies and merge them all into one
_.forEach(registeredProxies, (proxyName) => {
  /* eslint-disable global-require */
  // Import proxy schema
  const proxySchema = require(`./${_.snakeCase(proxyName)}`).default;

  // Merge proxy schema with initial one
  schema = _.assign(schema, proxySchema);
});

Proxies.schema = new SimpleSchema(schema);
// Attach translation
Proxies.schema.i18n('schemas.proxies');

Proxies.attachSchema(Proxies.schema);
