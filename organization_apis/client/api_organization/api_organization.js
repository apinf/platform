/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Organizations from '/organizations/collection';
import OrganizationApis from '../../collection';

Template.apiOrganization.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to user managed organizations, controls template visibility
  instance.subscribe('userManagedOrganizations');
});

Template.apiOrganization.helpers({
  userIsOrganizationManager () {
    // Get current User ID
    const userId = Meteor.userId();

    // Get organizations where User is manager
    const organizations = Organizations.find({ managerIds: userId });

    // Make sure user is manager of at least one organization
    return (organizations.count() > 0);
  },
  organizationApi () {
    // Return Organization APIs document, if available
    return OrganizationApis.findOne();
  },
});

Template.apiOrganization.events({
  'click #disconnect-from-organization': function (event, templateInstance) {
    // Get Organization API document from local context
    const organizationApi = OrganizationApis.findOne();

    // Get Organization from instance API
    const organization = templateInstance.data.api.organization();

    /* As information to the delete modal, pass in the Organization document.
    This is needed so that the Organization name can be shown in the dialog */
    Modal.show('deleteOrganizationApiConfirmation', { organizationApi, organization });
  },
});
