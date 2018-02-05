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

      if (errorType === 'user-not-registered') {
        // Get error message translation
        const message = TAPi18n.__('organizationManagerForm_userNotRegistered_errorText');

        // Display error
        sAlert.error(message, { timeout: 'none' });
      }

      if (errorType === 'manager-already-exist') {
        // Get error message translation
        const message = TAPi18n.__('organizationManagerForm_managerAlreadyExist_errorText');

        // Display error
        sAlert.error(message, { timeout: 'none' });
      }
    },
  },
});
