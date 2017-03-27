/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  emqtt: {
    type: Object,
    optional: true,
  },
  'emqtt.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'emqtt.elasticsearch': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
};
