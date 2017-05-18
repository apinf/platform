/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  apiUmbrella: {
    type: Object,
    optional: true,
  },
  'apiUmbrella.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'apiUmbrella.apiKey': {
    type: String,
  },
  'apiUmbrella.authToken': {
    type: String,
  },
  'apiUmbrella.elasticsearch': {
    type: String,
  },
};
