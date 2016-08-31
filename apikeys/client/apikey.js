Template.apikey.events({
  'click #getApiKeyButton' (event) {
    Meteor.call('createApiKeyForCurrentUser', function(error, result) {
      if(error) {
        sAlert.error(error);
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
    const currentUser = Meteor.user();

    // Make sure user exitsts and has API key
    if (currentUser) {
      // Get API Key
      //const apiKey = currentUser.profile.apiKey;

      return apiKey;
    }
  }
});
