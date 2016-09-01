AutoForm.hooks({
  settingsForm: {
    onSuccess () {
      // Get success message translation string
      const successMessage = TAPi18n.__('settingsForm-successMessage');

      // Display success message to user
      FlashMessages.sendSuccess(successMessage);
    },
    onError (formType, error) {
      FlashMessages.sendError(error);
    },
  },
});
