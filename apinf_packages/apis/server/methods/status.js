/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import { MonitoringData } from '/apinf_packages/monitoring/collection';

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
