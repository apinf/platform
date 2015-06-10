//Meteor.startup(function () {
//  // Check if API Umbrella settings are available
//  SyncedCron.add({
//    name: 'Sync API Umbrella Users',
//    schedule: function(parser) {
//      // parser is a later.parse object
//      return parser.text('every 1 day');
//    },
//    job: function() {
//      Meteor.call("syncApiUmbrellaUsers");
//    }
//  });
//});
//
//SyncedCron.start();


Meteor.startup(function () {
  // Check if API Umbrella settings are available
  if (Meteor.settings.api_umbrella) {
    // Get users from API Umbrella instance
    var response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
    console.log(response.data);

    // Add each user to collection if not already there
    _.each(response.data, function (item) {
      // Get existing user
      var existingApi = ApiBackends.findOne({'id': item.id});

      // If user doesn't exist in collection, insert into collection
      if (! existingApi ) {
          ApiBackends.insert(item);
      };
    });
  };
});
