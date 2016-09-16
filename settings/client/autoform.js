AutoForm.hooks({
  settings: {
    onSuccess () {
      // Call for configuration updates
      Meteor.call('updateGithubConfiguration');
      Meteor.call('updateMailConfiguration');

      // Get settings form success message translation
      const message = TAPi18n.__('settings_successMessage');

      // Alert the user of successful save
      sAlert.success(message);
    },
  },
});
