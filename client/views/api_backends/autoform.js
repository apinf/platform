AutoForm.hooks({
  apiBackends: {
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
        response = Meteor.call('createApiBackendOnApiUmbrella', apiBackendForm, function(error, apiUmbrellaWebResponse) {

          //apiUmbrellaWebResponse contents
          // apiUmbrellaWebResponse = {
          //   result: {},
          //   http_status: 200,
          //   errors: {}
          // };

          if (apiUmbrellaWebResponse.http_status === 200) {
            // Submit form on meteor:api-umbrella success
            context.result(apiBackendForm);
          } else {
            // Error data structure returned.
            // nowadays, jerry-rig solution:
            // {"default":'{"backend_protocol":["is not included in the list"]}}'
            // after https://github.com/brylie/meteor-api-umbrella/issues/1 is resolved, it should be:
            // {"frontend_host":["must be in the format of \"example.com\""],
            //  "backend_host":["must be in the format of \"example.com\""],
            //  "base":["must have at least one url_matches"],
            //  "servers[0].host":["must be in the format of \"example.com\"","Could not resolve host: no address for http://api.example.com"],
            //  "servers[0].port":["can't be blank","is not included in the list"]}
            var errors = _.values(apiUmbrellaWebResponse.errors);

            // Flatten all error descriptions to show using sAlert
            errors = _.flatten(errors);
            _.each(errors, function(error) {
              //Display error to the user, keep the sAlert box visible.
              sAlert.error(error, {timeout: 'none'});
              // TODO: Figure out a way to send the errors back to the autoform fields, as if it were client validation,
              //   and get rid of sAlert here.
            });

            //Cancel form submission on error, so user see the sAlert.error message and edit the incorrect fields
            context.result(false);
          }
        });
      }
    },
    onSuccess: function (formType, apiBackendId) {
      //Redirect to the just created API Backend page
      Router.go('viewApiBackend', {_id: apiBackendId});
    }
  }
});
