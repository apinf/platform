AutoForm.hooks({
  settings: {
    onSuccess () {
      // Get settings form success message translation
      const message = TAPi18n.__('settings_successMessage');

      // Alert the user of successful save
      sAlert.success(message);
    },
  },
});
