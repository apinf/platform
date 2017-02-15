// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APINF imports
import validateSchema from './validation';

AutoForm.addHooks('proxyForm', {
  before: {
    insert (formData) {
      if (formData.name && formData.description && formData.type) {
        // Get type of proxy
        const type = formData.type;
        // Check that proxy object is not empty or undefined
        const proxyData = formData[type];
        // Validate schema for filling all requiired fields
        const validation = proxyData ? validateSchema(type, proxyData) : false;

        // Return form data if validation is okay
        if (validation) {
          return formData;
        }
      }

      // Otherwise create & show message
      const message = TAPi18n.__('proxyForm_errorText');
      sAlert.error(message);

      return false;
    },
  },
  onSuccess () {
    // Hide modal
    Modal.hide('addProxy');

    // TODO: multi-proxy support
    // Meteor.call('syncApiBackends');

    // Create and show message
    const message = TAPi18n.__('proxyForm_successText');
    sAlert.success(message);
  },
  onError (formType, error) {
    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  },
});
