Meteor.startup(function () {
  // Make sure all API backends have bookmark counts
  Meteor.call('setAllApiBackendBookmarkCounts');

  // Make sure all API backends have average ratings
  Meteor.call('setAllApiBackendAverageRatings');

  // Restart all cron worker
  Meteor.call('restartCron');
  SyncedCron.start()
});
