AutoForm.hooks({
  updateProfile: {
    before: {
      update (user) {
        const userUnset = user.$unset;
        // Check if username is empty
        if (userUnset.username === '') {
          // Inform user about error
          const errorMessage = TAPi18n.__('profile_usernameInvalid');
          sAlert.error(errorMessage);
          // Cancel form
          return false;
        } else {
          // Otherwise return changes
          return user;
        }
      },
    },
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

Template.profile.helpers({
  currentUser () {
    return Meteor.user();
  },
  usersCollection () {
    // Return reference to Meteor.users collection
    return Meteor.users;
  },
});
