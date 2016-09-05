AutoForm.hooks({
  settings: {
    onSuccess () {
      FlashMessages.sendSuccess('Settings saved.');
    },
  },
});
