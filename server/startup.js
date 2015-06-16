Meteor.startup(function () {
  // Check if API Umbrella settings are available
  SyncedCron.add({
    name: 'Sync API Umbrella Users',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 10 sec');
    },
    job: function() {
      Meteor.call("syncApiUmbrellaUsers");
      Meteor.call("syncApiUmbrellaAdmins");
    }
  });
});

SyncedCron.start();
