/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.organizationCatalogGrid.onCreated(function () {
  this.autorun(() => {
    // Get organizations
    const organizations = Template.currentData().organizations;

    const organizationLogoIds = [];

    // Get list of logo IDs
    organizations.forEach((organization) => {
      if (organization.organizationLogoFileId) {
        organizationLogoIds.push(organization.organizationLogoFileId);
      }
    });

    // Subscribe to Organization logo collection by logo IDs
    this.subscribe('organizationLogosByIds', organizationLogoIds);
  });
});
