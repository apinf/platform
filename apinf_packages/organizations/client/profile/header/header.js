/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import OrganizationLogo from '/apinf_packages/organizations/logo/collection/collection';

Template.organizationProfileHeader.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get organization data using reactive way
    const organization = Template.currentData().organization;

    if (organization && organization.organizationCoverFileId) {
      // Subscribe to Organization cover
      instance.subscribe('organizationCoverById', organization.organizationCoverFileId);
    }
  });

  instance.autorun(() => {
    // Get organization data using reactive way
    const organization = Template.currentData().organization;

    if (organization && organization.organizationLogoFileId) {
      // Subscribe to current Organization logo
      instance.subscribe('currentOrganizationLogo', organization.organizationLogoFileId);
    }
  });
});

Template.organizationProfileHeader.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});

Template.organizationProfileHeader.events({
  'click #edit-organization': function (event, templateInstance) {
    // Get organization from template instance
    const organization = templateInstance.data.organization;

    // Show organization form modal
    Modal.show('organizationForm', { organization, formType: 'update' });
  },
});
