/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { SyncedCron } from 'meteor/percolate:synced-cron';

Meteor.startup(() => {
  // Make sure all API backends have bookmark counts
  Meteor.call('setAllApiBackendBookmarkCounts');

  // Make sure all API backends have average ratings
  Meteor.call('setAllApiBackendAverageRatings');

  // Restart all cron worker
  Meteor.call('restartCron');
  SyncedCron.start();
});
