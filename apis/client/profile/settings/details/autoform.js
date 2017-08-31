/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Apis from '/apis/collection';

AutoForm.hooks({
  apiDetailsForm: {
    onSuccess () {

      // Getting new slug from this.udateDoc

      const slug = this.updateDoc.$set.slug;
      if (slug) {
        
        // Redirect to updated API with new slug. It is use while api's name will update slug have to change that's mean routing change
        FlowRouter.go('viewApi', { slug: slug });
      } else {
        // Otherwise Redirect to API Catalog
        FlowRouter.go('apiCatalog');
      }
      // Get success message translation
      const message = TAPi18n.__('apiDetailsForm_text_updateInformation');

      // Show message
      sAlert.success(message);
    },
  },
});
