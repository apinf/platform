import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  organizationManagerForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('organizationManagerForm_successMessage');

      // Alert user of success
      sAlert.success(message);
    },
    onError (formType, error) {
      // Get error type string from error object
      const errorType = error.error;

      if (errorType === 'email-not-registered') {
        // Get 'email not registered' error message translation
        const message = TAPi18n.__('organizationManagerForm_emailNotRegistered_errorText');

        // Warn manager that user email is not registered
        sAlert.warning(message);
      }
    },
  },
});
