/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Collection imports
import OrganizationCover from '/organizations/cover/collection/collection';

Template.viewOrganizationCover.helpers({
  uploadedOrganizationCoverLink () {
    // Get organization from template data
    const organization = Template.currentData().organization;

    if (organization && organization.organizationCoverFileId) {
      // Get organization cover id
      const organizationCoverFileId = organization.organizationCoverFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

      // Get organization cover file Object
      const organizationCoverFile = OrganizationCover.findOne(objectId);

      // Check if organization cover file is available
      if (organizationCoverFile) {
        // Get absolute URL
        const absoluteUrl = Meteor.absoluteUrl().slice(0, -1);

        // Get cover base URL
        const coverBaseUrl = OrganizationCover.baseURL;

        // Get cover MD5
        const coverMd5 = organizationCoverFile.md5;

        // Get organization cover file URL
        return `${absoluteUrl}${coverBaseUrl}/md5/${coverMd5}`;
      }
    }
    // Return placeholder image
    return '/img/placeholder-logo.jpg';
  },
});
