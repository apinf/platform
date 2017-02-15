
import Apis from '/apis/collection';
import { MonitoringData } from '/monitoring/collection';

Meteor.methods({
  getApiStatus (apiId, url) {
    // Make sure apiId is a string
    check(apiId, String);

    // Make sure url is a string
    check(url, String);

    // Call HTTP request
    Meteor.http.get(url, {}, (error, result) => {
      // Set status code
      const serverStatusCode = result ? result.statusCode : 404;

      // Create a monitoring data
      const monitoringData = {
        date: new Date(),
      };

      // Update an api status
      Apis.update(apiId, { $set: { latestMonitoringStatusCode: serverStatusCode } });

      // Add the monitoring data in Collection
      MonitoringData.update({ apiId }, { $push: { responses: monitoringData } });
    });
  },
});
