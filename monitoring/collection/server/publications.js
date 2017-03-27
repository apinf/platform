/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import { MonitoringSettings } from '/monitoring/collection';

Meteor.publish('monitoringSettings', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  return MonitoringSettings.find({ apiId });
});
