/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import { MonitoringSettings, MonitoringData } from './';

// APInf imports
import { apiMonitoringEndpointRegEx } from './lib/regex';

// Describe collection for store data associate with monitoring settings
MonitoringSettings.schema = new SimpleSchema({
  apiId: {
    type: String,
  },
  enabled: {
    type: Boolean,
    optional: true,
  },
  data: {
    type: String,
    optional: true,
  },
  endPoint: {
    type: String,
    optional: true,
    regEx: apiMonitoringEndpointRegEx,
  },
  url: {
    type: String,
    regEx: apiMonitoringEndpointRegEx,
    custom () {
      let validation = false;
      if (this.value.match(SimpleSchema.RegEx.Url)) {
        validation = true;
      }


      if (validation === true) {
        const monitoringUrlEnabled = this.field('enabled').value;
        const monitoringUrl = this.value;
        // Require editor host if apiDocumentationEditor.enabled is checked
        if (monitoringUrlEnabled === true && !monitoringUrl) {
          validation = 'required';
        }
      }
      return validation;
    },
  },
});

// Describe collection for store data form server
MonitoringData.schema = new SimpleSchema({
  apiId: {
    type: String,
  },
  responses: {
    type: [Object],
    optional: true,
  },
  'responses.$.date': {
    type: Date,
    optional: true,
  },
  'responses.$.server_status_code': {
    type: String,
    optional: true,
  },
  'responses.$.end_point': {
    type: String,
    optional: true,
  },
});
// Enable translations (i18n)
MonitoringSettings.schema.i18n('schemas.monitoring');
MonitoringSettings.attachSchema(MonitoringSettings.schema);
MonitoringData.attachSchema(MonitoringData.schema);
