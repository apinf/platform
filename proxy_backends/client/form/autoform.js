AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (api) {
        // Get API Umbrella configuration
        Meteor.call('createApiBackendOnApiUmbrella',
          api.apiUmbrella,
          (error, response) => {
            if (error) {
              console.log('error', error);
            } else {
              console.log('response', response);

              if (
                response.result &&
                response.result.data &&
                response.result.data.api
              ) {
                // Get the API Umbrella ID for newly created backend
                const umbrellaBackendId = response.result.data.api.id;

                // Attach the API Umbrella backend ID to backend document
                api.apiUmbrella.id = umbrellaBackendId;

                // Insert the API document, asynchronous
                this.result(api);
              }
            }
          });
      },
      update () {
        // TODO: update backend on API Umbrella, and publish changes
        console.log('update');
        console.log('current document', this.currentDoc);
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
