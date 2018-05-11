/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import EmqAnalyticsData from './index';

EmqAnalyticsData.schema = new SimpleSchema({
  proxyId: {
    type: String,
    optional: false,
  },
  topicsId: {
    type: String,
    optional: false,
  },
  date: {
    type: Number,
    optional: false,
  },
  date_as_string: {
    type: String,
    optional: false,
  },
  time_as_string: {
    type: String,
    optional: false,
  },
  topic: {
    type: String,
    optional: false,
  },
  publishedMessages: {
    type: Number,
    optional: false,
  },
  deliveredMessages: {
    type: Number,
    optional: false,
  },
  publishedClients: {
    type: Number,
    optional: false,
  },
  subscribedClients: {
    type: Number,
    optional: false,
  },
  incomingBandwidth: {
    type: Number,
    optional: false,
  },
  outgoingBandwidth: {
    type: Number,
    optional: false,
  },
  incomingMessageSizeBytes: {
    type: Number,
    optional: false,
  },
  outgoingMessageSizeBytes: {
    type: Number,
    optional: false,
  },
});

EmqAnalyticsData.attachSchema(EmqAnalyticsData.schema);
