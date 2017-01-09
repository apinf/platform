import { Meteor } from 'meteor/meteor';
import { Apis } from '../';

Meteor.publish('myManagedApis', function () {
  // get current user id
  const userId = this.userId;

  // Get API Backends that user manages
  return Apis.find({ managerIds: userId });
});

Meteor.publish('apiBackend', function (backendId) {
  return Apis.find({ _id: backendId });
});

Meteor.publish('latestPublicApis', function (limit) {
  // Return cursor to latest API Backends
  return Apis.find(
    { isPublic: true },
    { sort: { created_at: -1 }, limit }
    );
});

// Publish collection for pagination
new Meteor.Pagination(Apis);
