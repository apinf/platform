/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.organizationSettingsDelete.events({
  // event handler to execute when delete API button is clicked
  'click #delete-organization': function () {
    const organization = this.organization;
    // Show modal form & pass organization document to modal form
    Modal.show('deleteOrganizationConfirmation', { organization });
  },
});
