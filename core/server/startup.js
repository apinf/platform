Meteor.startup(function () {
  try {
    // Run migrations
    Migrations.migrateTo('latest');
    
    Meteor.call("createApiUmbrellaWeb");

    // Check if API Umbrella settings are available
    SyncedCron.add({
      name: 'Sync API Umbrella Users and API Backends',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 hour');
      },
      job: function() {
        Meteor.call("syncApiUmbrellaUsers");
        Meteor.call("syncApiUmbrellaAdmins");
        Meteor.call("syncApiBackends");
      }
    });

    // Initialize cron jobs
    SyncedCron.start();
  }
  // otherwise show an error
  catch (error) {
    console.log(error);
  }

});
