// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ApiMetadata from '/metadata/collection/';

Meteor.publish('apiMetadata', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  // Get metadata document for API Backend
  // TODO: migrate ApiMetadata schema to use 'apiId' instead of 'apiBackendId'
  const apiMetadata = ApiMetadata.find({ apiBackendId: apiId });

  return apiMetadata;
});
