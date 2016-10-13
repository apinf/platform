// Meteor packages import
import { Meteor } from 'meteor/meteor';

// APINF import
import { MonitoringSettings } from '/monitoring/collection';

Meteor.publish('monitoringSettings', function (apiId) {
  return MonitoringSettings.find({ apiId });
});

