// APINF import
import { Monitoring } from '/monitoring/collection';
import { Apis } from '/apis/collection';

Meteor.methods({
  getApiStatus (apiId, url) {
    // Call HTTP request
    Meteor.http.get(url, {}, (error, result) => {
      // Set status code
      const serverStatusCode = result ? result.statusCode : 404;

      // Create a monitoring data
      const monitoringData = {
        date: new Date(),
        status_code: serverStatusCode,
      };

      // Update an api status
      Apis.update({ _id: apiId }, { $set: { latestMonitoringStatusCode: serverStatusCode } });

      // Add the monitoring data in Collection
      Monitoring.update({ apiId }, { $push: { requests: monitoringData } });
    });
  }
});
