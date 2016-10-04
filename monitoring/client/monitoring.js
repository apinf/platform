// Meteor package imports
import { Template } from 'meteor/templating';

// Apinf import
import { Monitoring } from '/monitoring/collection';

Template.apiMonitoring.onCreated(function () {
  // Get reference of template instance
  const instance = this;

  // Get api id
  const apiId = instance.data.api._id;

  // Subscribe on Monitoring collection
  instance.subscribe('monitoring', apiId);
});

Template.apiMonitoring.onRendered(function () {
  // Show a small popup on clicking the help icon
  $('[data-toggle="popover"]').popover();
});

Template.apiMonitoring.helpers({
  apiMonitoringSettings () {
    // Get api id
    const apiId = this.api._id;

    // Get api monitoring document
    return Monitoring.findOne({ apiId });
  },
  monitoringCollection () {
    // Collection for autoform
    return Monitoring;
  },
  formType () {
    // Get API ID
    const apiId = this.api._id;

    // Look for existing monitoring document for this API
    const existingSettings = Monitoring.findOne({ apiId });

    if (existingSettings) {
      return 'update';
    } else {
      return 'insert';
    }
  },
});
