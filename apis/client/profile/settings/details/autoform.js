// Meteor package import
import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  apiDetailsForm: {
    onSuccess () {
      // User just updated API information
      const message = TAPi18n.__('apiBackendForm_text_updateInformation');
      // Show message
      sAlert.success(message);
    },
  },
});
