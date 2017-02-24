import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';
import Proxies from '../';

import registeredProxies from '../registered_proxies';

import apiUmbrellaSchema from './api_umbrella';
import emqttSchema from './emqtt';

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
// Attach translation
Proxies.schema.i18n('schemas.proxies');

Proxies.attachSchema(Proxies.schema);
