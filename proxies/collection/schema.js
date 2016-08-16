import { Proxies } from './';
import proxiesList from '../default/list';

import { apiUmbrellaSchema } from '../default';
import { kongSchema } from '../default';
import { tykSchema } from '../default';

import _ from 'lodash';

const schema = {
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

const newSchema = _.assign(schema, apiUmbrellaSchema, kongSchema, tykSchema);

Proxies.schema = new SimpleSchema(newSchema);

Proxies.attachSchema(Proxies.schema);
