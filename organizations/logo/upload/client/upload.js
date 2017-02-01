/* eslint-env browser */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { Mongo } from 'meteor/mongo';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import OrganizationLogo from '/organizations/logo/collection/collection';
import Organizations from '../../../collection';

Template.uploadOrganizationLogo.onCreated(function () {
  const instance = this;

  // Subscribe to Organization logo
  instance.subscribe('allOrganizationLogo');
});

Template.uploadOrganizationLogo.events({
  'click .delete-organizationLogo': function (event, templateInstance) {
    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(TAPi18n.__('uploadOrganizationLogo_confirm_delete'));

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get organizationLogoFileId from organization
      const organizationLogoFileId = templateInstance.data.organization.organizationLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

      // Remove Organization logo object
      OrganizationLogo.remove(objectId);

      // Remove Organization logo file id field
      Organizations.update(templateInstance.data.organization._id, {
        $unset: { organizationLogoFileId: '' },
      });

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

    let url;
    // Check if Organization logo file is available
    if (organizationLogoFile) {
      // Get Organization logo file URL
      url = [
        Meteor.absoluteUrl().slice(0, -1),
        OrganizationLogo.baseURL,
        '/md5/',
        organizationLogoFile.md5,
      ].join('');
    }
    return url;
  },
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
