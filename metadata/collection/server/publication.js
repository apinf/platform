import { ApiMetadata } from '../';

Meteor.publish("apiMetadata", function (apiBackendId) {
  // Get metadata document for API Backend
  let apiBackendMetadata = ApiMetadata.find({apiBackendId});

  return apiBackendMetadata;
});
