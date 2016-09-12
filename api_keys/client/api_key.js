import { ApiKeys } from '/api_keys/collection';

Template.apikey.onCreated(function () {
  this.subscribe('apiKeysForCurrentUser');
});

Template.apikey.events({
  'click #getApiKeyButton': function (event) {
    Meteor.call('createApiKey', function (error, result) {
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

Template.apikey.helpers({
  currentUser () {
    return Meteor.user();
  },
  apiKey () {
    // Get current user
    const currentUserId = Meteor.userId();

    // Make sure user exists and has API key
    if (currentUserId) {
      // Get API Key
      const apiKey = ApiKeys.findOne({ 'userId': currentUserId });

      // Check that Umbrella API key exists
      if (apiKey && apiKey.apiUmbrella) {
        // Shorten key to be shown in UI
        return apiKey.apiUmbrella.apiKey;
      }
    }
  },
  apiKeyShort () {
    // Get current user
    const currentUserId = Meteor.userId();

    // Make sure user exists and has API key
    if (currentUserId) {
      // Get API Key
      const apiKey = ApiKeys.findOne({ 'userId': currentUserId });

      // Check that Umbrella API key exists
      if (apiKey && apiKey.apiUmbrella) {
        // Shorten key to be shown in UI
        return apiKey.apiUmbrella.apiKey.substring(0, 15) + '...';
      }
    }
  },
});
