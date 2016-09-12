import { Apis } from '/apis/collection';

AutoForm.hooks({
  editApiForm: {
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key], button').attr('disabled', 'disabled');
      // Change button text
      $('#add-apibackends').text('Submitting...');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key], button').removeAttr('disabled');
      // Change button text to original
      $('#add-apibackends').text('Submit');
    },
    before: {
      insert (apiBackendForm) {
        // Keep the context to use inside the callback function
        const context = this;

        // Send the API Backend to API Umbrella
        Meteor.call('createApiBackendOnApiUmbrella', apiBackendForm, function (error, apiUmbrellaWebResponse) {
          if (apiUmbrellaWebResponse.http_status === 200) {
            // Get the API Backend ID from API Umbrella
            const apiUmbrellaApiId = apiUmbrellaWebResponse.result.data.api.id;

            // Append the API Umbrella ID to the local API Backend
            apiBackendForm.id = apiUmbrellaApiId;

            context.result(apiBackendForm);
          } else {
            let errors = _.values(apiUmbrellaWebResponse.errors);

            // Flatten all error descriptions to show using sAlert
            errors = _.flatten(errors);
            _.each(errors, function (error) {
              // Display error to the user, keep the sAlert box visible.
              sAlert.error(error, { timeout: 'none' });
              // TODO: Figure out a way to send the errors back to the autoform fields, as if it were client validation,
              // and get rid of sAlert here.
            });

            // Cancel form submission on error, so user see the sAlert.error message and edit the incorrect fields
            context.result(false);
          }
        });
      },
      update (apiBackendForm) {
        // Keep the context to use inside the callback function
        const context = this;

        // Get current API Backend document for modification
        const apiBackend = context.currentDoc;

        // Get the set of updated properties
        const setApiBackendProperties = context.updateDoc.$set;

        // Get the set of properties to remove
        const unsetApiBackendProperties = context.updateDoc.$unset;

        // Update properties on API Backend document
        for (const property in setApiBackendProperties) {
          apiBackend[property] = setApiBackendProperties[property];
        }

        // Delete unused properties from API Backend object
        for (const property in unsetApiBackendProperties) {
          delete apiBackend[property];
        }

        // Get ID of API Umbrella backend (not the Apinf document ID)
        const apiUmbrellaBackendId = apiBackend.id;

        // Send the API Backend to API Umbrella
        response = Meteor.call(
          'updateApiBackendOnApiUmbrella',
          apiUmbrellaBackendId,
          apiBackend,
          function (error, apiUmbrellaWebResponse) {
            // Check for API Umbrella error
            if (apiUmbrellaWebResponse.http_status === 204) {
              // If status is OK, submit form
              context.result(apiBackendForm);
            } else {
              // If there are errors
              let errors = _.values(apiUmbrellaWebResponse.errors);

              // Flatten all error descriptions to show using sAlert
              errors = _.flatten(errors);
              _.each(errors, function (error) {
                // Display error to the user, keep the sAlert box visible.
                sAlert.error(error, { timeout: 'none' });
                // TODO: Figure out a way to send the errors back to the autoform fields, as if it were client validation,
                //   and get rid of sAlert here.
              });

              // Cancel form submission on error,
              // so user see the error message and edit the incorrect fields
              context.result(false);
            }
          });
      },
    },
    onSuccess () {
      // Get current API Backend ID
      const apiBackendId = this.docId;

      // Attach API Backend ID to API Doc, if possible
      if (Session.get('apiDocsId')) {
        // Get the API Documentation ID, if available
        const apiDocsId = Session.get('apiDocsId');

        // Add the API Backend ID to the API Documentation document
        ApiDocs.update(
          apiDocsId,
          {
            $set: {
              apiBackendId,
            },
          }
        );

        // Reset the apiDocsID Session variable
        Session.set('apiDocsId', undefined);
      }


      // Redirect to the just created API Backend page
      Router.go('viewApiBackend', { _id: apiBackendId });

      // Get the API Backend object
      const apiBackend = Apis.findOne(apiBackendId);

      // Get API Umbrella backend ID from API Backend
      const apiUmbrellaApiId = apiBackend.id;

      // Publish the API Backend on API Umbrella
      Meteor.call('publishApiBackendOnApiUmbrella', apiUmbrellaApiId, function (error, apiUmbrellaWebResponse) {
        // Check for a successful response
        if (apiUmbrellaWebResponse.http_status === 201) {
          // Get success message translation
          const message = TAPi18n.__('publishApiBackendOnApiUmbrella_successMessage');
          // Alert the user of the success
          sAlert.success(message);
        } else {
          // If there are errors, inform the user
          let errors = _.values(apiUmbrellaWebResponse.errors);

          // Flatten all error descriptions to show using sAlert
          errors = _.flatten(errors);
          _.each(errors, function (error) {
            // Display error to the user, keep the sAlert box visible.
            sAlert.error(error, { timeout: 'none' });
          });
        }
      });
    },
  },
});
