// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import OrganizationApis from '/organization_apis/collection';
import ApiMetadata from '/metadata/collection';

AutoForm.addHooks('editApiMetadataForm', {
  before: {
    insert (metadata) {
      // Get API ID, from Router
      const apiId = FlowRouter.getParam('_id');

      // Set the API ID property of the metadata document
      metadata.apiId = apiId;

      return metadata;
    },
  },
  onSuccess (formType, id) {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  },
});
