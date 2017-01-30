import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

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

Meteor.publish('allApisByIds', (apiIds) => {
  // Make sure apiIds is an Array
  check(apiIds, Array);

  // Find one or more APIs using an array of API IDs
  return Apis.find({ _id: { $in: apiIds } });
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('publicApisByIds', function (apiIds) {
  // Make sure apiIds is an Array
  check(apiIds, Array);

  // Get user id
  const userId = this.userId;

  // Placeholder for filtering
  let filteredApis;

  // Case: Registered users
  if (userId) {
    // Case: user is manager of APIs or without APIs

    // Select available managed apis of current organization
    filteredApis = {
      _id: { $in: apiIds },
      $or: [
        { isPublic: true },
        { managerIds: userId },
        { authorizedUserIds: userId },
      ],
    };
  } else {
    // Case: Anonymous users

    // Show all public managed apis of current organization
    filteredApis = { _id: { $in: apiIds }, isPublic: true };
  }

  // Find one or more APIs using an array of API IDs
  return Apis.find(filteredApis);
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
