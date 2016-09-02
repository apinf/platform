AutoForm.addHooks(['settings'], {
  onSuccess () {
    FlashMessages.sendSuccess('Settings saved.');
  },
});
