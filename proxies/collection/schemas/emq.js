/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  emq: {
    type: Object,
    optional: true,
  },
  'emq.brokerEndpoints': {
    type: Array,
  },
  'emq.brokerEndpoints.$': {
    type: Object,
  },
  'emq.brokerEndpoints.$.protocol': {
    type: String,
    allowedValues: [
      'MQTT',
      'MQTT over websockets',
    ],
  },
  'emq.brokerEndpoints.$.host': {
    type: String,
  },
  'emq.brokerEndpoints.$.port': {
    type: Number,
  },
  'emq.brokerEndpoints.$.tls': {
    type: Boolean,
  },
  'emq.httpApi': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      placeholder: 'https://user:pasword@host[:port][path]',
    },
  },
  'emq.elasticsearch': {
    type: String,
  },
};
