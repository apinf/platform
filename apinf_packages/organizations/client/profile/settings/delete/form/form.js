/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.deleteOrganizationConfirmation.events({
  'click #delete-organization-modal': function (event, templateInstance) {
    // Get organization
    const organization = templateInstance.data.organization;
    // Route to organization Catalog
    FlowRouter.go('organizationCatalog');

    Meteor.call('removeOrganization', organization._id, () => {
      // Dismiss the confirmation modal
      Modal.hide('deleteOrganizationConfirmation');

      // Get success message translation
      const message = TAPi18n.__('deleteOrganizationConfirmation_successMessage');

      // Alert the user of success
      sAlert.success(message + organization.name);
    });
  },
});
