import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import { OrganizationLogo } from '/organizations/logo/collection/collection';
import { Organizations } from '/organizations/collection';

Template.uploadOrganizationLogo.onCreated(function () {
  const instance = this;

  // Subscribe to Organization logo
  instance.subscribe('allOrganizationLogo');
});

Template.uploadOrganizationLogo.events({
  'click .delete-organizationLogo': function (event, templateInstance) {
    // Show confirmation dialog to user
    const confirmation = confirm(TAPi18n.__('uploadOrganizationLogo_confirm_delete'));


    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get organization documentationFileId
      const organizationLogoFileId = templateInstance.data.organization.organizationLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

      // Remove Organization logo object
      OrganizationLogo.remove(objectId);

      // Remove Organization logo file id field
      Organizations.update(templateInstance.data.organization._id, { $unset: { organizationLogoFileId: '' } });

      // Get deletion success message
      const message = TAPi18n.__('uploadOrganizationLogo_successfully_deleted');

      sAlert.success(message);
    }
  },
});

Template.uploadOrganizationLogo.helpers({
  uploadedLogoLink () {
    const organizationLogoFileId = Organizations.findOne().organizationLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

    // Get Organization logo file Object
    const organizationLogoFile = OrganizationLogo.findOne(objectId);

    // Check if Organization logo file is available
    if (organizationLogoFile) {
      // Get Organization logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + OrganizationLogo.baseURL + '/md5/' + organizationLogoFile.md5;
    }
  },
  uploadedOrganizationLogoFile () {
    let organizationLogoFileId;
    const organization = Organizations.findOne();
    // Check if organization found
    if (organization) {
      organizationLogoFileId = organization.organizationLogoFileId;
      // Check if organizationLogoFileId
      if (organizationLogoFileId) {
        // Convert to Mongo ObjectID
        const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

        // Get Organization logo file Object
        const organizationLogoFile = OrganizationLogo.findOne(objectId);

        return organizationLogoFile;
      }
    }
  },
});
