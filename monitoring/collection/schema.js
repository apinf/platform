// Meteor packages import
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// APINF import
import { Monitoring } from './';

Monitoring.schema = new SimpleSchema({
  apiId: {
    type: String,
  },
  enabled: {
    type: Boolean,
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
  },
  requests: {
    type: [Object],
    optional: true,
  },
  'requests.$.date': {
    type: String,
    optional: true,
  },
  'requests.$.status_code': {
    type: String,
    optional: true,
  },
  'requests.$.apiStatus': {
    type: String,
    optional: true,
  },
});
// Enable translations (i18n)
Monitoring.schema.i18n('schemas.monitoring');

Monitoring.attachSchema(Monitoring.schema);
