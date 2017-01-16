import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  connectionApiForm: {
    onSuccess () {
      // Create & show message about successfully saving
      const message = TAPi18n.__('connectionApiForm_successText');
      sAlert.success(message);

      // Close form
      Modal.hide('connectApiToOrganizationModal');
    },
    onError () {
      // Create & show error message
      const message = TAPi18n.__('connectionApiForm_errorText');
      sAlert.error(message);
    },
  },
});
