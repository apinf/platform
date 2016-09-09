import { ApiKeys } from '/api_keys/collection';

Template.apikey.onCreated(function() {
  this.subscribe('apiKeysForCurrentUser');
});

Template.apikey.events({
  'click #getApiKeyButton' (event) {
    Meteor.call('createApiKey', function(error, result) {
      if(error) {
        sAlert.error(error);
      } else {
        sAlert.success(TAPi18n.__('apikey_button_success'));
      }
    });
  }
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
      const apiKey = ApiKeys.findOne({'userId': currentUserId});

      // Check that Umbrella API key exists
      if(apiKey && apiKey.apiUmbrella) {
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
      const apiKey = ApiKeys.findOne({'userId': currentUserId});

      // Check that Umbrella API key exists
      if(apiKey && apiKey.apiUmbrella) {
        // Shorten key to be shown in UI
        return apiKey.apiUmbrella.apiKey.substring(0,18) + "...";
      }

    }
  }
});
