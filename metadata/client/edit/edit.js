import { ApiMetadata } from '/metadata/collection/collection';

Template.editApiMetadata.helpers({
  apiMetadataCollection () {
    // Return a reference to the API Metadata collection
    return ApiMetadata;
  }
  metadata () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get API Backend metadata
    let apiMetadata = ApiMetadata.findOne({apiBackendId});

    return apiMetadata;
  },
  submitButtonText () {
    // Get translation string for submit button text
    return TAPi18n.__("editApiMetadata_submitButtonText");
  }
});
