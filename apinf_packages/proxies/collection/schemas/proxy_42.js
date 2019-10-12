/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  proxy42: {
    type: Object,
    optional: true,
  },
  'proxy42.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
};
