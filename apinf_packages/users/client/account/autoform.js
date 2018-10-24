/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  updateProfile: {
    onSuccess () {
      // Get update success message translation
      const message = TAPi18n.__('profile_updatedSuccess');

      // Alert user of success
      sAlert.success(message);
    },
    onError () {
      // TODO: find better way to handle username taken, and other errors
      // this.addStickyValidationError('username', 'usernameTaken');
    },
  },
});
