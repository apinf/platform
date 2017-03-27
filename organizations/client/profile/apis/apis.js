/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.organizationApis.events({
  'click #connect-api': () => {
    // Get Organization from template instance
    const organization = Template.currentData().organization;

    // Check organization exist
    if (organization) {
      // Show modal with list of suggested apis and id of current organization
      Modal.show('connectApiToOrganizationModal', { organization });
    } else {
      // Otherwise show error
      const message = TAPi18n.__('organizationProfile_text_error');
      sAlert.error(message);
    }
  },

});
