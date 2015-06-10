Meteor.startup(function () {
  // Check if API Umbrella settings are available
  SyncedCron.add({
    name: 'Sync API Umbrella Users',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 1 day');
    },
    job: function() {
      Meteor.call("syncApiUmbrellaUsers");
    }
  });
});

SyncedCron.start();
