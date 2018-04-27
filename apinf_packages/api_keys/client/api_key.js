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
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

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

Template.apiKey.onRendered(function () {
  // Get reference of template instance
  const instance = this;

  // Initialize Clipboard copy button
  instance.copyButton = new Clipboard('#copy-api-key');

  // Tell the user when copy is successful
  instance.copyButton.on('success', (event) => {
    // Get localized success message
    const message = TAPi18n.__('apiKeys_copySuccessful');

    // Display success message to user
    sAlert.success(message);
    // Show success message only once
    event.clearSelection();
  });
});

Template.apiKey.onDestroyed(function () {
  // Get object of Clipboard
  const copyButton = this.copyButton;
  // Free up memory
  copyButton.destroy();
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
  'click #regenerate-api-key': function () {
    // Get current template instance
    const instance = Template.instance();
    const api = Template.currentData().api;
    // Get api Key from template data
    const apiKey = instance.$('#api-key').val();
    // Get all api list linked to a api key
    const apisList = instance.apisList.get();
    // Show regenerate api key modal
    Modal.show('regenerateApiKey', { apisList, api, apiKey });
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

    // Don't show "Get API Key" button if proxtBackend is undefined
    return false;
  },
});
