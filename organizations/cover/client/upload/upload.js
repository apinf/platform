/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Collection imports
import OrganizationCover from '/organizations/cover/collection/collection';
import Organizations from '../../../collection';

Template.uploadOrganizationCover.onCreated(function () {
  const instance = this;

  // Subscribe to Organization cover
  instance.subscribe('organizationCover');
});

Template.uploadOrganizationCover.helpers({
  uploadedOrganizationLogoFile () {
    const organizationCoverFileId = Organizations.findOne().organizationCoverFileId;

    let organizationCoverFile;

    if (organizationCoverFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

      // Get Organization logo file Object
      organizationCoverFile = OrganizationCover.findOne(objectId);
    }
    return organizationCoverFile;
  },
});
