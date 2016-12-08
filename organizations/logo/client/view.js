import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { OrganizationLogo } from '/organizations/logo/collection/collection';

Template.viewOrganizationLogo.onCreated(function () {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allOrganizationLogo');
});

Template.viewOrganizationLogo.helpers({
  uploadedOrganizationLogoLink () {
    // Get API current API Backend from template data
    const organization = Template.currentData().organization;

    if (organization && organization.organizationLogoFileId) {
      // Get organization logo id
      const organizationLogoFileId = organization.organizationLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

      // Get organization logo file Object
      const organizationLogoFile = OrganizationLogo.findOne(objectId);

      // Check if organization logo file is available
      if (organizationLogoFile) {
        // Get organization logo file URL
        return `${Meteor.absoluteUrl().slice(0, -1)}${OrganizationLogo.baseURL}/md5/${organizationLogoFile.md5}`;
      }
    }
    // Return placeholder image
    return '/img/placeholder-logo.jpg';
  },
});
