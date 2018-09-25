/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import { MonitoringSettings, MonitoringData } from '/apinf_packages/monitoring/collection';

// APInf import
//  import convertStatusCode from '/apinf_packages/apis/client/profile/status/convert_status_code';

Template.apiMonitoring.onCreated(function () {
  // Get reference of template instance
  const instance = this;

  // Get api id
  const apiId = instance.data.api._id;

  // Subscribe on Monitoring collection
  instance.subscribe('monitoringSettings', apiId);
  instance.subscribe('getApiStatusRecordData', apiId);
});
Template.apiMonitoring.onRendered(() => {
  // Show a small popup on clicking the help icon
  $('[data-toggle="popover"]').popover();

  // Init tooltip
  $('[data-toggle="tooltip"]').tooltip();
});

Template.apiMonitoring.helpers({
  apiMonitoringSettings () {
    // Get api id
    const apiId = this.api._id;

    // Get api monitoring document
    return MonitoringSettings.findOne({ apiId });
  },
  monitoringCollection () {
    // Collection for autoform
    return MonitoringSettings;
  },
  formType () {
    // Get API ID
    const apiId = this.api._id;

    // Look for existing monitoring document for this API
    const existingSettings = MonitoringSettings.findOne({ apiId });
    if (existingSettings) {
      return 'update';
    }

    return 'insert';
  },
  apiStatusData () {
    const apiId = this.api._id;
    const monitoringData = MonitoringData.findOne({ apiId });
    if (monitoringData) {
      return monitoringData.responses;
    }
    return [];
  },
  apiStatusCode (code) {
    return code === '200';
  },
});
