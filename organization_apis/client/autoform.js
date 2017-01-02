import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  organizationApisForm: {
    onError (formType, error) {
      console.log(`error occurred: ${error}`);
    },
    onSuccess () {
      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');
      sAlert.success(message);
    },
  },
});
