/* Copyright 2019 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.organizationCatalogTable.onCreated(function () {
  this.autorun(() => {
    // Get organizations
   // const organizations = Template.currentData().organizations;
    const organizations = [
      { name: 'testinimi 1',},
      { name: 'testinimi 2',},
      { name: 'testinimi 3',},
      { name: 'testinimi 4',},
      { name: 'testinimi 5',},
      { name: 'testinimi 6',},
    ];


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
