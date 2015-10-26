AutoForm.hooks({
  apiBackends: {
    onSuccess: function (formType, apiBackendId) {
      // Send the API Backend to API Umbrella
      response = Meteor.call('createApiBackendOnApiUmbrella', apiBackendId, function(error, apiUmbrellaWebResponse) {

        //apiUmbrellaWebResponse contents
        // apiUmbrellaWebResponse = {
        //   result: {},
        //   http_status: 200,
        //   errors: {}
        // };

        if (apiUmbrellaWebResponse.http_status === 200) {
          //Redirect to the just created API Backend page
          Router.go('viewApiBackend', {_id: apiBackendId});
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

          //Remove apiBackendId from local mongoDB
          ApiBackends.remove({_id: apiBackendId});
       }
      });
    }
  }
});
