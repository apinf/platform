// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ApiBacklogItems from '/backlog/collection';

Meteor.publish('apiBacklogItems', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  // returning backlog items object for current apibackend
  return ApiBacklogItems.find({ apiBackendId });
});
