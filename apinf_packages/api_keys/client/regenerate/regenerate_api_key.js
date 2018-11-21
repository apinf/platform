/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.regenerateApiKey.events({
  'click #regenerate-api-key-confirm': function (event, templateInstance) {
    // Get apiKey from template data
    const apiKey = templateInstance.data.apiKey;

    // Get api from template data
    const api = templateInstance.data.api;

    // Get processing message translation
    const message = TAPi18n.__('apiKeys_getApiKeyButton_processing');
    // Set bootstrap loadingText
    $('#regenerate-api-key').button({ loadingText: message });

    // Set button to processing state
    $('#regenerate-api-key').button('loading');

    // Check api and apikey is defined
    if (api && apiKey) {
      // Call regenerateApiKey function
      Meteor.call('regenerateApiKey', api._id, apiKey, (error) => {
        if (error) {
          // Show human-readable reason for error
          sAlert.error(error.reason, { timeout: 'none' });
        } else {
          // Get success message translation
          const successMessage = TAPi18n.__('apiKeys_getApiKeyButton_success');

          // Alert the user of success
          sAlert.success(successMessage);

          // Reset processing button
          $('#regenerate-api-key').button('reset');
        }
      });
    }

    // Dismiss the confirmation modal
    $('#regenerate-api-key-confirmation-modal').modal('hide');
  },
});
