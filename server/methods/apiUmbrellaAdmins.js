Meteor.methods({
  "syncApiUmbrellaAdmins": function () {
    if (Meteor.settings.private.apiUmbrella) {
      // Get admin users from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      var apiAdmins = response.data.data;
      _.each(apiAdmins, function (apiAdmin) {
        // Get existing admin user
        var existingAdminUser = ApiUmbrellaAdmins.findOne({'id': apiAdmin.id});
        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    };
  }
});
