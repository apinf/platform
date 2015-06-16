Meteor.methods({
  "syncApiBackends":function () {
    // Check if API Umbrella settings are available
    if (Meteor.settings.api_umbrella) {
      // Get API Backends from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      var apiBackends = response.data.data;

      _.each(apiBackends, function (backend) {
        // Get existing API Backend
        var existingApiBackend = ApiBackends.findOne({'id': backend.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (! existingApiBackend ) {
          ApiBackends.insert(backend);
        };
      });
    };
  }
});
