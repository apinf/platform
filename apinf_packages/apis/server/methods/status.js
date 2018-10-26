/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import { MonitoringData } from '/apinf_packages/monitoring/collection';

Meteor.publish('getApiStatusRecordData', (apiId) => {
  // Make sure apiId is a string
  check(apiId, String);
  // Find all API Backends
  const startDate = new Date();
  const lastDate = new Date();
  lastDate.setDate(lastDate.getDate() - 1);
  const query = { responses: { $elemMatch: { date: { $gte: lastDate, $lte: startDate } } } };
  return MonitoringData.find({ apiId }, query);
});

Meteor.methods({
  getApiStatus (apiId, url, endPoint) {
    // Make sure apiId is a string
    check(apiId, String);
    // Make sure url is a string
    check(url, String);
    // Make sure endPoint is a String
    // eslint-disable-next-line new-cap
    check(endPoint, Match.Maybe(String));
    // Call HTTP request
    Meteor.http.get(url, {}, (error, result) => {
      // Set status code
      const serverStatusCode = result ? result.statusCode : 404;

      // Create a monitoring data
      const monitoringData = {
        date: new Date(),
        server_status_code: serverStatusCode,
        end_point: endPoint,
      };

      // Update an api status
      Apis.update(apiId, { $set: { latestMonitoringStatusCode: serverStatusCode } });

      // Add the monitoring data in Collection
      MonitoringData.update({ apiId }, { $push: { responses: monitoringData } });
    });
  },
});
