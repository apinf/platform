Meteor.startup(function () {
  // Check if API Umbrella settings are available
  SyncedCron.add({
    name: 'Testing cron task',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 1 second');
    },
    job: function() {
      console.log("here..");
      if (Meteor.settings.api_umbrella) {
        // Get users from API Umbrella instance
        var response = apiUmbrellaWeb.adminApi.v1.apiUsers.getUsers();

        // Add each user to collection if not already there
        _.each(response.data.data, function (item) {
          // Get existing user
          var existingUser = ApiUmbrellaUsers.findOne({'id': item.id});

          // If user doesn't exist in collection, insert into collection
          if (! existingUser ) {
            ApiUmbrellaUsers.insert(item);
          };
        });
      };
      return false;
    }
  });
});

SyncedCron.start();
