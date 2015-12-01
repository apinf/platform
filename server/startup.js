Meteor.startup(function () {
  //TODO: redirect to settings page if there are no settings in Settings Collection
  //  Router.onBeforeAction(function() {
  //    if ( Settings.findOne() ) {
  //      this.next();
  //    } else {
  //      this.redirect('/settings');
  //      this.next();
  //    }
  //  });

  // Create config object for API Umbrella Web interface
  var config = {
    baseUrl: Meteor.settings.apiUmbrella.baseUrl,
    apiKey: Meteor.settings.apiUmbrella.apiKey,
    authToken: Meteor.settings.apiUmbrella.authToken
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
