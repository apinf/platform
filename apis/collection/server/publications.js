import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import Organizations from '/organizations/collection';
import Apis from '../';

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('userManagedApis', function () {
  // Get current user id
  const userId = this.userId;

  // Get API Backends that user manages
  return Apis.find({ managerIds: userId });
});

Meteor.publish('apiBackend', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  return Apis.find({ _id: apiBackendId });
});

Meteor.publish('allOrganizationApisByIds', (apiIds) => {
  // Make sure apiIds is an Array
  check(apiIds, Array);

  // Find one or more APIs using an array of API IDs
  return Apis.find({ _id: { $in: apiIds } });
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('userVisibleApis', function (apiIds, slug) {
  // Make sure apiIds is an Array type
  check(apiIds, Array);
  // Make sure organization slug is a String type
  check(slug, String);

  // Get related organization document
  const organization = Organizations.findOne({ slug });

  let cursor = [];

  // If organization exists
  if (organization) {
    const userId = this.userId;

    // Return cursor on APIs collection which are visible for current user in organization profile
    cursor = organization.userVisibleApisCursor(apiIds, userId);
  }
  // Return empty array to flag publication as ready
  return cursor;
});

Meteor.publish('latestPublicApis', (limit) => {
  // Make sure limit is a Number
  check(limit, Number);

  // Return cursor to latest API Backends
  return Apis.find(
    { isPublic: true },
    { sort: { created_at: -1 }, limit }
  );
});

// Publish collection for pagination
// eslint-disable-next-line no-new
new Meteor.Pagination(Apis);
