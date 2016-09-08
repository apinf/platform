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
        console.log(result);
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

      return apiKey;
    }
  }
});
