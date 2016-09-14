AutoForm.hooks({
  updateProfile: {
    onSuccess (operation, result, template) {
      // Get update success message translation
      const message = TAPi18n.__('profile_updatedSuccess');

      // Alert user of success
      sAlert.success(message);
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
      // Get username 'update needed' message
      const message = TAPi18n.__('profile_setUsername');

      // Alert user of update needed
      sAlert.info(message);
    }
  }
};

Template.profile.helpers({
  currentUser () {
    return Meteor.user();
  },
  usersCollection () {
    // Return reference to Meteor.users collection
    return Meteor.users;
  },
});
