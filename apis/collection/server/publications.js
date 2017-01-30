import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Apis } from '../';

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('userManagedApis', function () {
  // get current user id
  const userId = this.userId;

  // Get API Backends that user manages
  return Apis.find({ managerIds: userId });
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('apiBackend', function (backendId) {
  check(backendId, String);

  return Apis.find({ _id: backendId });
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('allApisByIds', function (apiIds) {
  check(apiIds, Array);

  // Find one or more APIs using an array of API IDs
  return Apis.find({ _id: { $in: apiIds } });
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('publicApisByIds', function (apiIds) {
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

// eslint-disable-next-line prefer-arrow-callback
Meteor.publish('latestPublicApis', function (limit) {
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
