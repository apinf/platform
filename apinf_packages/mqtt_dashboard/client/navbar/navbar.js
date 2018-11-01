/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import Branding from '../../../branding/collection';
import ProjectLogo from '../../../branding/logo/collection';

Template.mqttDashboardNavbar.onCreated(function () {
  this.subscribe('projectLogo');
});

Template.mqttDashboardNavbar.helpers({
  uploadedProjectLogoLink () {
    // Check for existing branding
    const branding = Branding.findOne();

    // Make sure branding and project logo exist
    if (branding && branding.projectLogoFileId) {
      const projectLogoFileId = branding.projectLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(projectLogoFileId);

      // Get project logo file Object
      const projectLogoFile = ProjectLogo.findOne(objectId);

      // Check if project logo file is available
      if (projectLogoFile) {
        // Get API logo file URL
        return `${Meteor.absoluteUrl().slice(0, -1) +
        ProjectLogo.baseURL}/md5/${projectLogoFile.md5}`;
      }
    }

    return '';
  },
  projectLogoExists () {
    // Get branding if it exists
    const branding = Branding.findOne();

    // Check if branding and project logo file ID exist
    return !!(branding && branding.projectLogoFileId);
  },
});
