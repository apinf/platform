// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiMetadata from '../../collection';

Template.editApiMetadata.helpers({
  apiMetadataCollection () {
    // Return a reference to the API Metadata collection
    return ApiMetadata;
  },
  submitButtonText () {
    // Get translation string for submit button text
    return TAPi18n.__('editApiMetadata_submitButtonText');
  },
});
