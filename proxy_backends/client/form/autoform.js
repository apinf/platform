AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (api) {
        // Get API Umbrella configuration
        Meteor.call('createApiBackendOnApiUmbrella',
          api.apiUmbrella,
          (error, response) => {
            if (error) {
              // Throw a Meteor error
              Meteor.error(500, error);
            } else {
              // If success, attach API Umbrella backend ID to current document
              if (
                response.result &&
                response.result.data &&
                response.result.data.api
              ) {
                // Get the API Umbrella ID for newly created backend
                const umbrellaBackendId = response.result.data.api.id;

                // Attach the API Umbrella backend ID to backend document
                api.apiUmbrella.id = umbrellaBackendId;

                // Publish the API Backend on API Umbrella
                Meteor.call(
                  'publishApiBackendOnApiUmbrella',
                  umbrellaBackendId,
                  (error, result) => {
                    if (error) {
                      Meteor.throw(500, error);
                    } else {
                      // Insert the API document, asynchronous
                      this.result(api);
                    }
                  }
                );
              }
            }
          });
      },
      update () {
        // Keep the context to use inside the callback function
        const context = this;

        // Get current API document for modification
        const api = context.currentDoc;

        // Get ID of API Umbrella backend (not the Apinf document ID)
        const umbrellaBackendId = api.apiUmbrella.id;
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
