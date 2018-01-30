/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

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
        sAlert.error(message);
      }

      if (errorType === 'manager-already-exist') {
        // Get 'manager already exist' error message translation
        const message = TAPi18n.__('organizationManagerForm_managerAlreadyExist_errorText');

        // Warn manager that manager is already exist
        sAlert.error(message);
      }
    },
  },
});
