// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.addHooks('editApiMetadataForm', {
  before: {
    insert (metadata) {
      // Get API Backend ID, from Router
      const apiId = FlowRouter.getParam('_id');

      // Set the API Backend ID property of the metadata document
      metadata.apiBackendId = apiId;

      return metadata;
    },
  },
  onSuccess () {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  },
});
