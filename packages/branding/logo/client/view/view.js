/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import Branding from '/packages/branding/collection';
import ProjectLogo from '/packages/branding/logo/collection';

Template.viewProjectLogo.helpers({
  uploadedProjectLogoLink () {
    // TODO: Copy & pasted from Template.uploadProjectLogo.helpers.
    const currentProjectLogoFileId = this.branding.projectLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentProjectLogoFileId);

    // Get project logo file Object
    const currentProjectLogoFile = ProjectLogo.findOne(objectId);

    let projectLogoFileUrl;
    // Check if project logo file is available
    if (currentProjectLogoFile) {
      // Get Meteor absolute URL
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

      const baseProjectLogoFotoUrl = meteorAbsoluteUrl + ProjectLogo.baseURL;
      // Get project logo file URL
      projectLogoFileUrl = `${baseProjectLogoFotoUrl}/md5/${currentProjectLogoFile.md5}`;
    }
    return projectLogoFileUrl;
  },
  projectLogoExists () {
    const branding = Branding.findOne();

    return !!(branding.projectLogoFileId);
  },
});
