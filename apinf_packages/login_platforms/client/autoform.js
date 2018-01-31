/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APInf imports
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

// Define hooks for the form
AutoForm.hooks({
  loginPlatforms: {
    onSuccess () {
      // Call updateLoginPlatformsConfiguration through the promise wrapper
      promisifyCall('updateLoginPlatformsConfiguration')
        .then(result => {
          if (result) {
            // Get settings form success message translation
            const message = TAPi18n.__('settings_successMessage');

            // Alert the user of successful save
            sAlert.success(message);
          }
        })
        .catch(err => {
          if (err) {
            // Get settings form success message translation
            const message = TAPi18n.__('settings_errorMessage');
            // Alert the user of successful save
            sAlert.error(message, { timeout: 'none' });
          }
        });
    },
  },
});
