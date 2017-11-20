/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-disable meteor/audit-argument-checks */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ApiBackendRatings from '/apinf_packages/ratings/collection';

// Function imports
import serverFunctions from './functions.js';

// Deconstruct server serverFunctions
const {
  publishMyApiBackendRating,
  publishMyApiBackendRatings,
  publishApiBackendRatings,
} = serverFunctions;

// User rating for a single API Backend
Meteor.publish('myApiBackendRating', function (apiBackendId) {
  // Get function context
  const context = this;

  // Build function scope
  const functionScope = { check, ApiBackendRatings, context };

  // Build publish function scope and return publish data
  return publishMyApiBackendRating(functionScope)(apiBackendId);
});

// User ratings for all API Backends
Meteor.publish('myApiBackendRatings', function () {
  // Get function context
  const context = this;

  // Build function scope
  const functionScope = { ApiBackendRatings, context };

  // Build publish function scope and return publish data
  return publishMyApiBackendRatings(functionScope)();
});

// All ratings for a given API Backend, anonymized
Meteor.publish('apiBackendRatings', (apiBackendId) => {
  // Build function scope
  const functionScope = { check, ApiBackendRatings };

  // Build publish function scope and return publish data
  return publishApiBackendRatings(functionScope)(apiBackendId);
});
