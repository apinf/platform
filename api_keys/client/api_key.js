import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ApiKeys } from '/api_keys/collection';
import Clipboard from 'clipboard';

Template.apiKey.onCreated(function () {
  this.subscribe('apiKeysForCurrentUser');
});

Template.apiKey.onRendered(function () {
  // Initialize Clipboard copy button
  const copyButton = new Clipboard('#copy-api-key');

  // Tell the user when copy is successful
  copyButton.on('success', function (event) {
    // Get localized success message
    const message = TAPi18n.__('apiKeys_copySuccessful');

    // Display success message to user
    sAlert.success(message);
    // Show success message only once
    event.clearSelection();
  });
});


Template.apiKey.events({
  'click #get-api-key': function (event) {
    // Set bootstrap loadingText
    $('#get-api-key').button({ loadingText: TAPi18n.__('apiKeys_getApiKeyButton_processing') });

    // Set button to processing state
    $('#get-api-key').button('loading');

    // Call createApiKey function
    Meteor.call('createApiKey', (error, result) => {
      if (error) {
        sAlert.error(error);
      } else {
        sAlert.success(TAPi18n.__('apiKeys_getApiKeyButton_success'));
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
