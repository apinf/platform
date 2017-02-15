// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Proxies from '../';

// APINF imports
import apiUmbrellaSchema from './api_umbrella';
import emqttSchema from './emqtt';
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

schema = _.assign(schema, apiUmbrellaSchema, emqttSchema);

Proxies.schema = new SimpleSchema(schema);

Proxies.attachSchema(Proxies.schema);
