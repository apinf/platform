import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import Apis from '../';


Meteor.publish('userManagedApis', function () {
  // get current user id
  const userId = this.userId;

  // Get API Backends that user manages
  return Apis.find({ managerIds: userId });
});

Meteor.publish('apiBackend', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  return Apis.find({ _id: apiBackendId });
});

Meteor.publish('apisByIds', (apiIds) => {
  // Make sure apiIds is an Array
  check(apiIds, Array);

  // Find one or more APIs using an array of API IDs
  return Apis.find({ _id: { $in: apiIds } });
});

Meteor.publish('latestPublicApis', (limit) => {
  // Make sure apiIds is an Array
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
