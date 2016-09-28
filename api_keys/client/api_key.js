import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ApiKeys } from '/api_keys/collection';
import Clipboard from 'clipboard';

Template.apiKey.onCreated(function () {
  this.subscribe('apiKeysForCurrentUser');
});

Template.apiKey.onRendered(function () {
  // Get reference of template instance
  instance = this;
  
  // Initialize Clipboard copy button
  instance.copyButton = new Clipboard('#copy-api-key');

  // Tell the user when copy is successful
  instance.copyButton.on('success', function (event) {
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
  'click #get-api-key': function (event) {
    // Get processing message translation
    const message = TAPi18n.__('apiKeys_getApiKeyButton_processing');
    // Set bootstrap loadingText
    $('#get-api-key').button({ loadingText: message });

    // Set button to processing state
    $('#get-api-key').button('loading');

    // Call createApiKey function
    Meteor.call('createApiKey', (error, result) => {
      if (error) {
        sAlert.error(error);
      } else {
        // Get success message translation
        const message = TAPi18n.__('apiKeys_getApiKeyButton_success');

        // Alert the user of success
        sAlert.success(message);
      }
    });
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

    // Make sure user exists and has API key
    if (currentUserId) {
      // Get API Key document
      const userApiKey = ApiKeys.findOne({ userId: currentUserId });

      // Check that Umbrella API key exists
      if (userApiKey && userApiKey.apiUmbrella) {
        // Get the API Key, from API key document
        apiKey = userApiKey.apiUmbrella.apiKey;
      }
    }

    return apiKey;
  },
});
