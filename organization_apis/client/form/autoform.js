import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  organizationApisForm: {
    onError (formType, error) {
      // Show error message to user
      sAlert.error(error.message);
    },
    onSuccess () {
      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');

      // Show success message to user
      sAlert.success(message);

      // Dismiss connect API modal, if connecting API to Organization via modal
      Modal.hide('connectApiToOrganizationModal');
    },
  },
});
