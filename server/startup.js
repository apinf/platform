Meteor.startup(function () {

  // Get the settings
  var settings = Meteor.settings;

  // check is settings are exist
  var dbSettings = Settings.find().fetch();

  if ( dbSettings.length === 0 ) {
    // insert Meteor.settings into Settings Collection
    Settings.insert(settings);
  }

  // Updating Meteor.settings from Settings collection
  Meteor.call('updateMeteorSettings');

  try {

    // Store settings object
    var settings = Meteor.settings;
    // Check if something is already in collection
    if ( ! Settings.findOne() ) {
      // if not insert settings object
      Settings.insert(settings);
    }

    // Creating ApiUmbrellaWeb object
    Meteor.call("createApiUmbrellaWeb");

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
  // otherwise show an error
  catch (error) {
    console.log(error);
  }

  // Create indexes for fields in MongoDB collection (API backends search functionality)
  ApiBackends._ensureIndex({
    "name": 1,
    "backend_host": 1
  });

  SyncedCron.start();
});
