import { Proxies } from './';
import proxiesList from '../default/list';

import _ from 'lodash';

const defaultSchemas = require('../default');

let schema = {
  name: {
    type: String
  },
  description: {
    type: String,
    autoform: {
      rows: 5
    }
  },
  type: {
    type: String,
    allowedValues: proxiesList
  }
};

for (key in defaultSchemas) {
  schema = _.assign(schema, defaultSchemas[key].default);
}

Proxies.schema = new SimpleSchema(schema);

Proxies.attachSchema(Proxies.schema);
