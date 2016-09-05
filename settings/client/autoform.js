AutoForm.hooks({
  settings: {
    onSuccess () {
      // Get settings form success message translation
      const successMessage = TAPi18n.__('settings-successMessage');

      // Alert the user of successful save
      sAlert.success(successMessage);
    },
  },
});
