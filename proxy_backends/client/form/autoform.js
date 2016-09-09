AutoForm.hooks({
  proxyBackendForm: {
    onSuccess () {
      // Get success message translation
      const successMessage = TAPi18n.__('proxyBackendForm_successMessage');

      // Alert the user of success
      sAlert.success(successMessage);
    },
  },
});
