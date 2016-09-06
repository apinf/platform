AutoForm.hooks({
  proxyBackendSettingsForm: {
    onSuccess () {
      // Alert the user of success
      sAlert.success('Settings saved.');
    },
  },
});
