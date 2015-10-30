Meteor.methods({
  syncApiBackends: function () {
    // Check if API Umbrella settings are available
    if (Meteor.settings.api_umbrella) {
      // Get API Backends from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      var apiBackends = response.data.data;

      _.each(apiBackends, function (apiBackend) {
        // Get existing API Backend
        var existingApiBackend = ApiBackends.findOne({'id': apiBackend.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (existingApiBackend === undefined) {
          ApiBackends.insert(apiBackend);
        };
      });
    };
  },
  createApiBackendOnApiUmbrella: function (apiBackendForm) {
    console.log('Submitting Backend to API Umbrella.');

    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackendForm
    };

    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 200,
      errors: {}
    };

    // Send the API Backend to API Umbrella
    try {
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.createApiBackend(constructedBackend);
    } catch (apiUmbrellaError) {

      //apiUmbrellaError.message now is a string like
      // example 1:
      // '{"default":'{"backend_protocol":["is not included in the list"]}}'
      // ex 2:
      // '{"errors":{"frontend_host":["must be in the format of \"example.com\""],
      //            "backend_host":["must be in the format of \"example.com\""],
      //            "base":["must have at least one url_matches"],
      //            "servers[0].host":["must be in the format of \"example.com\"","Could not resolve host: no address for http://api.example.com"],
      //            "servers[0].port":["can't be blank","is not included in the list"]}'
      // }
      //after https://github.com/brylie/meteor-api-umbrella/issues/1 is closed, this code must be changed to something like:
      // apiUmbrellaWebResponse.errors = error.errors
      // apiUmbrellaWebResponse.status = error.http_status
      // or http://docs.meteor.com/#/full/meteor_error should be considered

      //set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }

    return apiUmbrellaWebResponse;
  }
});
