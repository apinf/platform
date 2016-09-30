// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { AutoForm } from 'meteor/aldeed:autoform';

// Apinf import
import { Monitoring } from '/monitoring/collection';
import { Apis } from '/apis/collection';

AutoForm.hooks({
  apiMonitoringForm: {
    before: {
      update: (doc) => {
        // Check form on validation
        if (AutoForm.validateForm('apiMonitoringForm')) {
          // Get new data
          const monitoringData = doc.$set;
          // If data was updated than enabled is false or url is updated
          // For apply new url, cron must be restarted
          // If enabled is false,cron must be stop too
          Meteor.call('stopCron', monitoringData.apiId);

          // Restart cron with new url
          if (monitoringData.enabled) {
            Meteor.call('startCron', monitoringData.apiId, monitoringData.url);
          }
          // Success resut
          return doc;
        } else {
          // Get success message translation
          const message = TAPi18n.__('apiMonitoringForm_errorMessage');

          // Alert the user of error
          sAlert.error(message);
          return false;
        }
      },
    },
    after: {
      insert: (error, result) => {
        if (result) {
          // Get monitoring document
          const monitoring = Monitoring.findOne({ _id: result });

          // Get api id
          const apiId = monitoring.apiId;

          // Link Monitoring collection with Apis collection
          Apis.update(apiId, { $set: { monitoringId: result } });

          // Start Cron
          Meteor.call('startCron', apiId, monitoring.url);
        }
      },
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_successMessage');

      // Alert the user of success
      sAlert.success(message);
    },
    onError () {
      // Get success message translation
      const message = TAPi18n.__('apiMonitoringForm_errorMessage');

      // Alert the user of error
      sAlert.error(message);
    },
  },
});
