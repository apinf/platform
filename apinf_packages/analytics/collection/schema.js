/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import AnalyticsData from './index';

const MetricsSchema = new SimpleSchema({
  requestPath: {
    type: String,
    optional: true,
  },
  medianResponseTime: {
    type: Number,
    optional: true,
  },
  percentile95ResponseTime: {
    type: Number,
    optional: true,
  },
  successCallsCount: {
    type: Number,
    optional: true,
  },
  redirectCallsCount: {
    type: Number,
    optional: true,
  },
  failCallsCount: {
    type: Number,
    optional: true,
  },
  errorCallsCount: {
    type: Number,
    optional: true,
  },
});

const ErrorSchema = new SimpleSchema({
  requestPath: {
    type: String,
    optional: true,
  },
  code: {
    type: Number,
    optional: true,
  },
  calls: {
    type: Number,
    optional: true,
  },
});

AnalyticsData.schema = new SimpleSchema({
  proxyId: {
    type: String,
    optional: false,
  },
  proxyBackendId: {
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
  prefix: {
    type: String,
    optional: false,
  },
  requestNumber: {
    type: Number,
    optional: false,
  },
  medianResponseTime: {
    type: Number,
    optional: false,
  },
  uniqueUsers: {
    type: Number,
    optional: false,
  },
  successCallsCount: {
    type: Number,
    optional: false,
  },
  redirectCallsCount: {
    type: Number,
    optional: false,
  },
  failCallsCount: {
    type: Number,
    optional: false,
  },
  errorCallsCount: {
    type: Number,
    optional: false,
  },
  allRequestPaths: {
    type: [String],
    optional: true,
  },
  requestPathsData: {
    type: [MetricsSchema],
    optional: true,
  },
  errors: {
    type: [ErrorSchema],
    optional: true,
  },
});

AnalyticsData.attachSchema(AnalyticsData.schema);
