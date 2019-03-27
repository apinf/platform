/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import { MonitoringSettings, MonitoringData } from '/apinf_packages/monitoring/collection';

AutoForm.hooks({
  apiMonitoringForm: {
    formToDoc: (doc) => {
      // doc.url =  doc.baseUrl + doc.endPoint;
      if (doc.endPoint) {
        doc.endPoint = doc.endPoint.replace(/([^:]\/)\/+/g, '$1').replace(/\/\//g, '/');
        doc.url = (doc.url + doc.endPoint).replace(/([^:]\/)\/+/g, '$1');
      }
      return doc;
    },

    formToModifier: (doc) => {
      // doc.$set.url = doc.$set.baseUrl + doc.$set.endPoint;
      if (doc.$set.endPoint) {
        doc.$set.endPoint = doc.$set.endPoint.replace(/([^:]\/)\/+/g, '$1').replace(/\/\//g, '/');
        doc.$set.url = (doc.$set.url + doc.$set.endPoint).replace(/([^:]\/)\/+/g, '$1');
      }
      return doc;
    },

    before: {
      update: (doc) => {
        // Check form on validation
        if (AutoForm.validateForm('apiMonitoringForm')) {
          // Get new data
          const monitoringData = doc.$set;
          // If data was updated than enabled is false or url is updated
          // For apply new url, cron must be restarted
          // If enabled is false, cron must be stop too
          Meteor.call('stopCron', monitoringData.apiId);

          // Restart cron with new url
          if (monitoringData.enabled) {
            Meteor.call('startCron',
             monitoringData.apiId, monitoringData.url);
          }
          // Success result
          return doc;
        }
        // Get success message translation
        const message = TAPi18n.__('apiMonitoringForm_errorMessage');

        // Alert the user of error
        sAlert.error(message, { timeout: 'none' });
        return false;
      },
    },
    after: {
      insert: (error, result) => {
        if (result) {
          // Get monitoring document
          const monitoring = MonitoringSettings.findOne(result);

          // Get api id
          const apiId = monitoring.apiId;

          MonitoringData.insert({ apiId }, (insertError, id) => {
            // Linked both collections
            MonitoringSettings.update(result, { $set: { data: id } });
          });

          // Link Monitoring collection with Apis collection
          Apis.update(apiId, { $set: { monitoringId: result } });

          // Start Cron
          Meteor.call('startCron', apiId, monitoring.url);
        }
      },
    },
    onSuccess () {
      // Get update values
      const updateFormValues = this.updateDoc ? this.updateDoc.$set : this.insertDoc;

      // If monitoring is enabled then get the API status immediately
      if (updateFormValues.enabled) {
        Meteor.call('getApiStatus',
         updateFormValues.apiId, updateFormValues.url, updateFormValues.endPoint);
      }

      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_successMessage');

      // Alert the user of success
      sAlert.success(message);
    },
    onError () {
      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_errorMessage');

      // Alert the user of error
      sAlert.error(message, { timeout: 'none' });
    },
  },
});
