Meteor.methods({
  "syncApiBackends":function () {
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
  'createApiBackendOnApiUmbrella': function (apiBackendId) {
    console.log('Submitting Backend to API Umbrella.')
    // Get the API Backend object
    var apiBackend = ApiBackends.findOne(apiBackendId);

    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackend
    };

    // Send the API Backend to API Umbrella
    var response = apiUmbrellaWeb.adminApi.v1.apiBackends.createApiBackend(constructedBackend);

    // TODO: Add error checking to ensure backend successfully inserted in API Umbrella
  }
});
