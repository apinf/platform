// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  apiDocumentationForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
