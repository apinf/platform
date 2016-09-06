AutoForm.hooks({
  proxyBackendForm: {
    onSuccess () {
      // Alert the user of success
      sAlert.success('Settings saved.');
    },
  },
});
