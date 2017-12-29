// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

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
  onSuccess (formType) {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');

    let message;

    // Metadata is created
    if (formType === 'insert') {
      message = TAPi18n.__('editApiMetadataForm_messageText_added');
    } else {
      // Metadata is updated
      message = TAPi18n.__('editApiMetadataForm_messageText_updated');
    }

    // Display message text
    sAlert.success(message);
  },
});
