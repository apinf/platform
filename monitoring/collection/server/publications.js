// Collection imports
import { MonitoringSettings } from '/monitoring/collection';

Meteor.publish('monitoringSettings', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  return MonitoringSettings.find({ apiId });
});

