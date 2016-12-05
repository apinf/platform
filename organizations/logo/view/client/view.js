import { Template } from 'meteor/templating';
import { OrganizationLogo } from '/organizations/logo/collection/collection';

Template.viewOrganizationLogo.onCreated(function () {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allOrganizationLogo');
});

Template.viewOrganizationLogo.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('.organization-file-browse'));
});

Template.viewOrganizationLogo.helpers({
  uploadedOrganizationLogoLink () {
    // Get API current API Backend from template data
    const organization = Template.currentData().organization;
    if (organization && organization.organizationLogoFileId) {
      const organizationLogoFileId = organization.organizationLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);
      // Get API logo file Object
      const organizationLogoFile = OrganizationLogo.findOne(objectId);
      // Check if API logo file is available
      if (organizationLogoFile) {
        // Get API logo file URL
        return `${Meteor.absoluteUrl().slice(0, -1) + OrganizationLogo.baseURL}/md5/${organizationLogoFile.md5}`;
      }
    }
  },
  organizationLogoExists () {
    const organization = Template.currentData().organization;

    if (organization && organization.organizationLogoFileId) {
      return true;
    }
  },
});
