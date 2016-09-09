AutoForm.hooks({
  updateProfile: {
    onSuccess (operation, result, template) {
      const profileUpdatedMsg = TAPi18n.__('profile_updatedSuccess');
      return sAlert.success(profileUpdatedMsg);
    },
    onError () {
      this.addStickyValidationError('username', 'usernameTaken');
    },
  },
});

Template.profile.rendered = function () {
  const instance = this;

  // Get logged in user
  const currentUser = Meteor.user();

  // Check logged in user exists
  if (currentUser) {
    // Ask user to set username if it is not set.
    if (!currentUser.username) {
      const setUsernameMsg = TAPi18n.__('profile-setUsername');
      sAlert.info(setUsernameMsg);
    }
  }
};

Template.profile.events({
  'click #umbrella-apikey-button': function (event) {
    Meteor.call('createApiKeyForCurrentUser', function (error, result) {
      if (error) {
        sAlert.error(error);
      }
    });
  },
});

Template.profile.helpers({
  currentUser () {
    return Meteor.user();
  },
  apiKey () {
    // Get current user
    const currentUser = Meteor.user();

    // Make sure user exitsts and has API key
    if (currentUser && currentUser.profile && currentUser.profile.apiKey) {
      // Get API Key
      const apiKey = currentUser.profile.apiKey;

      return apiKey;
    }
  },
  usersCollection () {
    // Return reference to Meteor.users collection
    return Meteor.users;
  },
});
