/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  authorizedUserForm: {
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('authorizedUserForm_success_message');

      // Alert user of success
      sAlert.success(message);
    },
    onError (formType, error) {
      // Get error type string from error object
      const errorType = error.error;

      if (errorType === 'user-not-registered') {
        // Get error message translation
        const message = TAPi18n.__('authorizedUserForm_errorText_userNotRegistered');

        // Display error
        sAlert.error(message, { timeout: 'none' });
      }

      if (errorType === 'user-already-exist') {
        // Get error message translation
        const message = TAPi18n.__('authorizedUserForm_errorText_alreadyAuthorized');

        // Display error
        sAlert.error(message, { timeout: 'none' });
      }
    },
  },
});
