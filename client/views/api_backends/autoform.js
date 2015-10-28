AutoForm.hooks({
  apiBackends: {
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('[data-schema-key], button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key], button').removeAttr("disabled");
    },
    before: {
      // Replace `formType` with the form `type` attribute to which this hook applies
      insert: function (apiBackendForm) {
        // Keep the context to use inside the callback function
        context = this;

        // Send the API Backend to API Umbrella
        response = Meteor.call('createApiBackendOnApiUmbrella', apiBackendForm, function(error, apiUmbrellaWebResponse) {

          //apiUmbrellaWebResponse contents
          // apiUmbrellaWebResponse = {
          //   result: {},
          //   http_status: 200,
          //   errors: {}
          // };

          if (apiUmbrellaWebResponse.http_status === 200) {
            //Return asynchronously
            context.result(apiBackendForm);
          } else {
            // ex 1:
            // {"default":'{"backend_protocol":["is not included in the list"]}}'
            // ex 2:
            // {"errors":{"frontend_host":["must be in the format of \"example.com\""],
            //            "backend_host":["must be in the format of \"example.com\""],
            //            "base":["must have at least one url_matches"],
            //            "servers[0].host":["must be in the format of \"example.com\"","Could not resolve host: no address for http://api.example.com"],
            //            "servers[0].port":["can't be blank","is not included in the list"]}
            // }

            var errors = _.values(apiUmbrellaWebResponse.errors);
            errors = _.flatten(errors);
            _.each(errors, function(error) {
              console.log(error);
              //Display error to the user, keep the sAlert box visible.
              sAlert.error(error, {timeout: 'none'});
              // Figure out a way to send the errors back to the autoform fields, as if it were client validation.
            });

            //Return error asynchronously
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
