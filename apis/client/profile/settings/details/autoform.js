/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  apiDetailsForm: {
    onSuccess () {
      // Get success message translation
      if (this.updateDoc && this.updateDoc.$set.name) {
        const slug = this.updateDoc.$set.name.split(' ').join('-').toLowerCase();
        // Redirect to newly added API
        FlowRouter.go('viewApi', { slug });
      } else {
        // Otherwise Redirect to API Catalog
        FlowRouter.go('apiCatalog');
      }
      const message = TAPi18n.__('apiDetailsForm_text_updateInformation');

      // Show message
      sAlert.success(message);
    },
  },
});
