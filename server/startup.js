Meteor.startup(function () {
  // Check if API Umbrella settings are available
  SyncedCron.add({
    name: 'Sync API Umbrella Users',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 5 seconds');
    },
    job: function() {
      Meteor.call("syncApiUmbrellaUsers");
      Meteor.call("addApiUbmrellaUserKey");
    }
  });
});

SyncedCron.start();
