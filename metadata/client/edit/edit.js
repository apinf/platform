import { ApiMetadata } from '/metadata/collection/collection';

Template.editApiMetadata.helpers({
  submitButtonText () {
    // Get translation string for submit button text
    return TAPi18n.__("editApiMetadata_submitButtonText");
  },
  apiMetadataCollection () {
    // Return a reference to the API Metadata collection
    return ApiMetadata;
  }
});
