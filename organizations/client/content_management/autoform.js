// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  numberOfMediasPerPageForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('organizationSettingsContentManagement_successMessage');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
