/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  settings: {
    onSuccess () {
      // Call for configuration updates
      Meteor.call('configureSmtpSettings');

      // Get settings form success message translation
      const message = TAPi18n.__('settings_successMessage');

      // Alert the user of successful save
      sAlert.success(message);
    },
  },
});
