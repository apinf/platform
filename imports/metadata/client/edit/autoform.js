// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Apis from '/imports/apis/collection';

AutoForm.addHooks('editApiMetadataForm', {
  before: {
    insert (metadata) {
      // Get related API document
      const api = Apis.findOne({ slug: FlowRouter.getParam('slug') });

      // Set the API ID property of the metadata document
      metadata.apiId = api._id;

      return metadata;
    },
  },
  onSuccess () {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  },
});
