Meteor.methods({
  "syncApiBackends":function () {
    // Check if API Umbrella settings are available
    if (Meteor.settings.apiUmbrella) {
      // Get API Backends from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      var apiBackends = response.data.data;

      _.each(apiBackends, function (apiBackend) {
        // Get existing API Backend
        var existingApiBackend = ApiBackends.findOne({'id': apiBackend.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (existingApiBackend === undefined) {
          try {
            ApiBackends.insert(apiBackend);
          } catch (error) {
            console.error("Error inserting apiBackend(" + apiBackend.id + ") : " + error);
          }
        };
      });
    };
  },
  createApiBackendOnApiUmbrella: function (apiBackendForm) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackendForm
    };

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 200,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.createApiBackend(constructedBackend);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella: function (apiBackendId) {
    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 201,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.config.publishSingleApiBackend(apiBackendId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  }
});
