// Meteor packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';
import Organizations from '../../../collection';

Template.uploadOrganizationLogo.onCreated(function () {
  const instance = this;

  // Subscribe to Organization logo
  instance.subscribe('allOrganizationLogo');
});

Template.uploadOrganizationLogo.helpers({
  uploadedOrganizationLogoFile () {
    const organizationLogoFileId = Organizations.findOne().organizationLogoFileId;

    let organizationLogoFile;

    if (organizationLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

      // Get Organization logo file Object
      organizationLogoFile = OrganizationLogo.findOne(objectId);
    }
    return organizationLogoFile;
  },
});

Template.uploadOrganizationLogo.events({
  'click .delete-organizationLogo': function (event, templateInstance) {
    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(TAPi18n.__('uploadOrganizationLogo_confirm_delete'));

    const organization = templateInstance.data.organization;

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get organizationLogoFileId from organization
      const organizationLogoFileId = organization.organizationLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

      // Remove Organization logo object
      OrganizationLogo.remove(objectId);

      // Remove Organization logo file id field
      Organizations.update(organization._id, {
        $unset: { organizationLogoFileId: '' },
      });

      // Get deletion success message
      const message = TAPi18n.__('uploadOrganizationLogo_successfully_deleted');

      sAlert.success(message);
    }
  },
});

