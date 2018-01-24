/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import OrganizationLogo from '/apinf_packages/organizations/logo/collection/collection';

import '/apinf_packages/organizations/client/profile/header/header.html';
import '/apinf_packages/organizations/cover/client/view.js';
import '/apinf_packages/organizations/logo/client/view.js';
import './social-media-icons/social-media-icons.html';

Template.organizationProfileHeader.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get organization data using reactive way
    const organization = Template.currentData().organization;

    if (organization) {
      if (organization.organizationCoverFileId) {
        // Subscribe to Organization cover
        instance.subscribe('organizationCoverById', organization.organizationCoverFileId);
      }
      // Get organization data using reactive way
      if (organization && organization.organizationLogoFileId) {
        // Subscribe to current Organization logo
        instance.subscribe('currentOrganizationLogo', organization.organizationLogoFileId);
      }
      const branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        DocHead.setTitle(`${branding.siteTitle} - ${organization.name}`);
      }
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
