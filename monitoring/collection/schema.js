// Meteor packages import
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// APINF import
import { MonitoringSettings, MonitoringData } from './';

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

      // Require editor host if apiDocumentationEditor.enabled is checked
      if (monitoringUrlEnabled === true && !monitoringUrl) {
        validation = 'required';
      }
      return validation;
    },
  }
});

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
  }
});
// Enable translations (i18n)
MonitoringSettings.schema.i18n('schemas.monitoring');

MonitoringSettings.attachSchema(MonitoringSettings.schema);
MonitoringData.attachSchema(MonitoringData.schema);

