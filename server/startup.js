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

  if (Meteor.settings.private) {

    // Store settings object
    var settings = Meteor.settings.private;
    // Check if something is already in collection
    if ( ! Settings.findOne() ) {
      // if not insert settings object
      Settings.insert(settings);
    }

    // Check if something is on Settings collection
    if ( Settings.findOne() ) {
      // Create config object for API Umbrella Web interface from Settings collection
      var config = {
        baseUrl: Settings.findOne().apiUmbrella.baseUrl,
        apiKey: Settings.findOne().apiUmbrella.apiKey,
        authToken: Settings.findOne().apiUmbrella.authToken
      };
    } else {
      // Create config object for API Umbrella Web interface from Meteor.settings.private
      var config = {
        baseUrl: Meteor.settings.private.apiUmbrella.baseUrl,
        apiKey: Meteor.settings.private.apiUmbrella.apiKey,
        authToken: Meteor.settings.private.apiUmbrella.authToken
      };
    }

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
  }

});


SyncedCron.start();
