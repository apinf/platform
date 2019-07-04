/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import Clipboard from 'clipboard';

// Collection imports
import ApiKeys from '/apinf_packages/api_keys/collection';

Template.apiKey.onCreated(function () {
  // Subscribe to apiKeys for current user
  this.subscribe('apiKeysForCurrentUser');

  // Get reference to template instance
  const instance = this;
  // Init the  apisList reactive variable
  instance.apisList = new ReactiveVar();
  // Get proxyBackend from template data
  const proxyBackend = Template.currentData().proxyBackend;

  // Get Apis list
  Meteor.call('getApisList', proxyBackend.proxyId, (error, result) => {
    if (error) {
      // Show human-readable reason for error
      sAlert.error(error.reason, { timeout: 'none' });
    } else {
      // Set result in reactive variable
      instance.apisList.set(result);
    }
  });
});

Template.apiKey.onRendered(() => {
  const apiKeyCopy = new Clipboard('#api-key-copy');

  // Tooltip position for copyApiUrl
  $('#api-key-copy').tooltip({
    trigger: 'click',
    placement: 'bottom',
  });

  // Tell the user when copying API URL is successful
  apiKeyCopy.on('success', () => {
    $('#api-key-copy').tooltip('hide')
    .attr('data-original-title', 'Copied!')
    .tooltip('show');
  });
});

Template.apiKey.events({
  'click #get-api-key': function () {
    // Get current template instance
    const instance = Template.instance();

    // Get processing message translation
    const message = TAPi18n.__('apiKeys_getApiKeyButton_processing');
    // Set bootstrap loadingText
    instance.$('#get-api-key').button({ loadingText: message });

    // Set button to processing state
    instance.$('#get-api-key').button('loading');

    // Get api from template data
    const api = Template.currentData().api;

    // Check api is defined
    if (api) {
      // Call createApiKey function
      // eslint-disable-next-line no-unused-vars
      Meteor.call('createApiKey', api._id, (error, result) => {
        if (error) {
          // Show human-readable reason for error
          sAlert.error(error.reason, { timeout: 'none' });
        } else {
          // Get success message translation
          const successMessage = TAPi18n.__('apiKeys_getApiKeyButton_success');

          // Alert the user of success
          sAlert.success(successMessage);
        }
      });
    }
  },
  'click #regenerate-api-key': function (event, templateInstance) {
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

Template.apiKey.helpers({
  currentUser () {
    return Meteor.user();
  },
  apiKey () {
    // Placeholder for API key
    let apiKey;

    // Get current user
    const currentUserId = Meteor.userId();

    // Get proxyBackend from template data
    const proxyBackend = Template.currentData().proxyBackend;

    // Make sure user exists and has API key
    if (proxyBackend && currentUserId) {
      // Get API Key document
      const userApiKey = ApiKeys.findOne({ userId: currentUserId, proxyId: proxyBackend.proxyId });

      // Check that Umbrella API key exists
      if (userApiKey && userApiKey.apiUmbrella) {
        // Get the API Key, from API key document
        apiKey = userApiKey.apiUmbrella.apiKey;
      }
    }

    return apiKey;
  },
  showButton () {
    // Get proxyBackend from template data
    const proxyBackend = Template.currentData().proxyBackend;

    // Check is proxy backend exists and contains type field
    if (proxyBackend && proxyBackend.type) {
      // Check if proxy backend type is "apiUmbrella"
      const proxyBackendIsApiUmbrella = proxyBackend.type === 'apiUmbrella';

      return proxyBackendIsApiUmbrella;
    }

    // Don't show "Get API Key" button if proxyBackend is undefined
    return false;
  },
});
