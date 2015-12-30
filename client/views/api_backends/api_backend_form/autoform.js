AutoForm.hooks({
  apiBackendForm: {
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('[data-schema-key], button').attr("disabled", "disabled");
      // Change button text
      $('#add-apibackends').text('Submitting...');
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key], button').removeAttr("disabled");
      // Change button text to original
      $('#add-apibackends').text('Submit');
    },
    before: {
      insert: function (apiBackendForm) {
        // Keep the context to use inside the callback function
        var context = this;

        // Send the API Backend to API Umbrella
        Meteor.call('createApiBackendOnApiUmbrella', apiBackendForm, function(error, apiUmbrellaWebResponse) {

          if (apiUmbrellaWebResponse.http_status === 200) {
            // Get the API Backend ID from API Umbrella
            var apiUmbrellaApiId = apiUmbrellaWebResponse.result.data.api.id;

            // Append the API Umbrella ID to the local API Backend
            apiBackendForm.id = apiUmbrellaApiId;

            context.result(apiBackendForm);
          } else {
            var errors = _.values(apiUmbrellaWebResponse.errors);

            // Flatten all error descriptions to show using sAlert
            errors = _.flatten(errors);
            _.each(errors, function(error) {
              // Display error to the user, keep the sAlert box visible.
              sAlert.error(error, {timeout: 'none'});
              // TODO: Figure out a way to send the errors back to the autoform fields, as if it were client validation,
              // and get rid of sAlert here.
            });

            // Cancel form submission on error, so user see the sAlert.error message and edit the incorrect fields
            context.result(false);
          }
        });
      }
    },
    onSuccess: function (formType, apiBackendId) {
      // Attach API Backend ID to API Doc, if possible
      if (Session.get('apiDocsId')) {
        // Get the API Documentation ID, if available
        var apiDocsId = Session.get('apiDocsId');

        // Add the API Backend ID to the API Documentation document
        ApiDocs.update(
          apiDocsId,
          {
            $set: {
              apiBackendId: apiBackendId
            }
          }
        );

        // Reset the apiDocsID Session variable
        Session.set('apiDocsId', undefined);
      }


      // Redirect to the just created API Backend page
      Router.go('viewApiBackend', {_id: apiBackendId});

      // Get the API Backend object
      var apiBackend = ApiBackends.findOne(apiBackendId);

      // Get API Umbrella backend ID from API Backend
      var apiUmbrellaApiId = apiBackend.id;

      // Publish the API Backend on API Umbrella
      Meteor.call('publishApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {
        console.log(apiUmbrellaWebResponse);

        if (apiUmbrellaWebResponse.http_status === 201) {
          sAlert.success("API Backend successfully published.");
        } else {
          var errors = _.values(apiUmbrellaWebResponse.errors);

          // Flatten all error descriptions to show using sAlert
          errors = _.flatten(errors);
          _.each(errors, function(error) {
            // Display error to the user, keep the sAlert box visible.
            sAlert.error(error, {timeout: 'none'});
          });
        }
      });
    }
  }
});
