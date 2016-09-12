import _ from 'lodash';
import { Proxies } from '../';

const apiUmbrellaSchema = require('./api_umbrella').default;

let schema = {
  name: {
    type: String,
  },
  description: {
    type: String,
    autoform: {
      rows: 5,
    },
  },
  type: {
    type: String,
    defaultValue: 'apiUmbrella',
    allowedValues: ['apiUmbrella', 'kong', 'tuk'],
  },
};

schema = _.assign(schema, apiUmbrellaSchema);

Proxies.schema = new SimpleSchema(schema);

Proxies.attachSchema(Proxies.schema);
