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
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  organizationSettingsGeneral: {
    onSuccess () {
      // Getting name from this.udateDoc
      const organizationName = this.updateDoc.$set.name;
      if (organizationName) {
        Meteor.call('updateOrganizationBySlug', { name: organizationName }, (error, slug) => {
          if (error) {
            // Show error message
            sAlert.error(error, { timeout: 'none' });
            // Redirect to organization catalog
            FlowRouter.go('organizations');
          } else {
            // Get success message translation
            const message = TAPi18n.__('organizationSettingsGeneral_update_successMessage');

            // Show success message to user
            sAlert.success(message);
            // Redirect to newly added organization
            FlowRouter.go('organizationProfile', { slug });
          }
        });
      }
    },
    onError () {
      // Get failure message translation
      const message = TAPi18n.__('organizationSettingsGeneral_update_failedMessage');

      // Show failure message to user
      sAlert.error(message, { timeout: 'none' });
    },
  },
});
