AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (api) {
        console.log(api);
      },
      update () {
        // TODO: update backend on API Umbrella, and publish changes
        console.log(this.currentDoc);
      },
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('proxyBackendForm_successMessage');

      // Alert the user of success
      sAlert.success(message);
    },
  },
});
