AutoForm.hooks({
  settingsForm: {
    onSuccess () {
      FlashMessages.sendSuccess('Settings saved.');
    },
    onError (formType, error) {
      FlashMessages.sendError(error);
    },
  },
});
