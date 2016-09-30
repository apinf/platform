// Meteor packages import
import { Meteor } from 'meteor/meteor';

// APINF import
import { Monitoring } from '/monitoring/collection';

Meteor.publish('monitoring', function (apiId) {
  return Monitoring.find({ apiId });
});
