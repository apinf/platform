Meteor.startup(function () {
  // Create config object for API Umbrella Web interface
  var config = {
    baseUrl: Settings.findOne().api_umbrella_base_url,
    apiKey: Settings.findOne().api_umbrella_api_key,
    authToken: Settings.findOne().api_umbrella_auth_token
  };

  // Create API Umbrella Web object for REST calls
  apiUmbrellaWeb = new ApiUmbrellaWeb(config);

  // Check if API Umbrella settings are available
  SyncedCron.add({
    name: 'Sync API Umbrella Users and API Backends',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 1 day');
    },
    job: function() {
      Meteor.call("syncApiUmbrellaUsers");
      Meteor.call("syncApiUmbrellaAdmins");
      Meteor.call("syncApiBackends");
    }
  });
  Meteor.call("syncApiUmbrellaUsers");
  Meteor.call("syncApiBackends");

});

SyncedCron.start();
