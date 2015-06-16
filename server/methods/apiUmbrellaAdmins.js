Meteor.methods({
  "syncApiUmbrellaAdmins": function () {
    if (Meteor.settings.api_umbrella) {
    // Get admin users from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      _.each(response.data.data, function (item) {
        // Get existing admin user
        var existingAdminUser = ApiUmbrellaAdmins.findOne({'id': item.id});
        // If admin user doesn't exist in collection, insert into collection
        if (! existingAdminUser ) {
          ApiUmbrellaAdmins.insert(item);
        }
      });
    };
  }
});
