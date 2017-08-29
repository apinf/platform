// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ApiMetadata from '/apinf_packages/metadata/collection/';

Meteor.publish('apiMetadata', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  // Get metadata document for API Backend
  const apiMetadata = ApiMetadata.find({ apiId });

  // Return database cursor or empty array
  return apiMetadata || [];
});
