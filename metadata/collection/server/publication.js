import { ApiMetadata } from '/metadata/collection/';

Meteor.publish('apiMetadata', function (apiId) {
  // Get metadata document for API Backend
  // TODO: migrate ApiMetadata schema to use 'apiId' instead of 'apiBackendId'
  const apiMetadata = ApiMetadata.find({ apiBackendId: apiId });

  return apiMetadata;
});
