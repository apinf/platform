/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  apiDetailsForm: {
    onSuccess () {
      // Getting name from this.udateDoc
      const apiName = this.updateDoc.$set.name;

      if (apiName) {
        Meteor.call('updateApiBySlug', { name: apiName }, (error, slug) => {
          if (error) {
            // Show error message
            sAlert.error(error, { timeout: 'none' });
            // Redirect to api catalog
            FlowRouter.go('apiCatalog');
          } else {
            // Redirect to modified api
            FlowRouter.go('viewApi', { slug });
          }
        });
      }

      // Get success message translation
      const message = TAPi18n.__('apiDetailsForm_text_updateInformation');

      // Show message
      sAlert.success(message);
    },
  },
});
