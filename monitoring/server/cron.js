// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';

// APINF import
import { Monitoring } from '/monitoring/collection';
import { Apis } from '/apis/collection';

// NPM packages import
import _ from 'lodash';

Meteor.methods({
  startCron (apiId, url) {
    // Create unique name for Cron job
    const uniqueName = 'Monitoring: ' + apiId;

    // Set time of the monitoring call
    const cronTime = 'every 1 hour';

    // Update api status to 'Loading...'
    Apis.update(apiId, { $set: { status_code: 0 } });


    // Create cron working
    SyncedCron.add({
      name: uniqueName,
      schedule (parser) {
        // parser is a later.parse object
        return parser.text(cronTime);
      },
      job () {
        // Call HTTP request
        Meteor.http.get(url, {}, (error, result) => {
          // Set status code
          const serverStatusCode = result ? result.statusCode : 500;

          // Create a monitoring data
          const monitoringData = {
            date: new Date(),
            status_code: serverStatusCode,
          };

          // Update an api status
          Apis.update({ _id: apiId }, { $set: { status_code: serverStatusCode } });

          // Add the monitoring data in Collection
          Monitoring.update({ apiId }, { $push: { requests: monitoringData } });
        });
      },
    });
  },
  stopCron (apiId) {
    // Create unique name for Cron job
    const uniqueName = 'Monitoring: ' + apiId;

    // Stop Cron job
    SyncedCron.remove(uniqueName);

    // Update an api status
    Apis.update({ _id: apiId }, { $set: { status_code: -1 } });
  },
  restartCron () {
    // Get all apis which are added in monitoring
    const monitoring = Monitoring.find().fetch();

    _.forEach(monitoring, (data) => {
      // If enabled is true then switch the monitoring
      if (data.enabled) {
        Meteor.call('startCron', data.apiId, data.url);
      }
    });
  },
});

