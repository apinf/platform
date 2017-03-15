// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
  onSuccess () {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  },
});
