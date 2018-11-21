/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.addHooks('updateApiAnalytics', {
  onSubmit (formValues) {
    // Get reference to form
    const form = this;

    // Prevent form from submitting
    form.event.preventDefault();

    if (formValues.daysCount < 1) {
      // The value has to be more than 0. Display error
      // Get error message translation
      const message = TAPi18n.__('sdkCodeGeneratorModal_errorTextInvalidHost');

      // Alert user of error
      sAlert.error(message, { timeout: 'none' });

      form.done(new Error(message));
    } else {
      Meteor.call('proxyBackendAnalyticsData',
        formValues.proxyBackendId, formValues.daysCount, formValues.lastDay, (error) => {
          if (error) {
            // The value has to be more than 0. Display error
            // Get error message translation
            const message = TAPi18n.__('sdkCodeGeneratorModal_errorTextInvalidHost');

            // Alert user of error
            sAlert.error(message, { timeout: 'none' });

            form.done(new Error(message));
          }
          // The value has to be more than 0. Display error
          // Get error message translation
          const message = TAPi18n.__('sdkCodeGeneratorModal_errorTextInvalidHost');

          // Alert user of error
          sAlert.success(message);

          form.done();
        });
    }
  },
});
