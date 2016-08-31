AutoForm.hooks({
  settingsForm: {
    onSuccess () {
      FlashMessages.sendSuccess('Settings saved.');
    },
  },
});
