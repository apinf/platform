// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

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
        // Get absolute URL
        const absoluteUrl = Meteor.absoluteUrl().slice(0, -1);

        // Get logo base URL
        const logoBaseUrl = OrganizationLogo.baseURL;

        // Get logo MD5
        const logoMd5 = organizationLogoFile.md5;

        // Get organization logo file URL
        return `${absoluteUrl}${logoBaseUrl}/md5/${logoMd5}`;
      }
    }
    // Return placeholder image
    return '/img/placeholder-logo.jpg';
  },
});
