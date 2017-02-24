import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { MonitoringSettings } from '/monitoring/collection';

Meteor.publish('monitoringSettings', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  return MonitoringSettings.find({ apiId });
});

