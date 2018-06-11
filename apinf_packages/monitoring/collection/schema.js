/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import { MonitoringSettings, MonitoringData } from './';

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
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    custom () {
      const monitoringUrlEnabled = this.field('enabled').value;
      const monitoringUrl = this.value;
      let validation;

      if (monitoringUrlEnabled === true && !monitoringUrl) {
        validation = 'required';
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
    type: String,
    optional: true,
  },
  'responses.$.server_status_code': {
    type: String,
    optional: true,
  },
});
// Enable translations (i18n)
MonitoringSettings.schema.i18n('schemas.monitoring');

MonitoringSettings.attachSchema(MonitoringSettings.schema);
MonitoringData.attachSchema(MonitoringData.schema);
