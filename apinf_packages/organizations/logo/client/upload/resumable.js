/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import OrganizationLogo from '/apinf_packages/organizations/logo/collection/collection';
import Organizations from '/apinf_packages/organizations/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  // Set organization logo id to organization collection on success
  OrganizationLogo.resumable.on('fileSuccess', (file) => {
    // Get slug
    const slug = FlowRouter.getParam('slug');

    // Get organization by slug
    const organization = Organizations.findOne({ slug });

    /* Step 1: Remove existing organization logo */

    // Get organization documentationFileId
    const organizationLogoFileId = organization.organizationLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

    // Remove Organization logo object
    OrganizationLogo.remove(objectId);

    /* Step 2: Update new organization logo */

    // Get the id from Organization logo file object
    const newOrganizationLogoFileId = file.uniqueIdentifier;

    // Update logo id field
    Organizations.update(
      organization._id,
      { $set: { organizationLogoFileId: newOrganizationLogoFileId } }
    );

    // Get success message translation
    const message = TAPi18n.__('organizationLogo_resumable_successfully_uploaded');

    sAlert.success(message);
  });

  // TODO: refactor this code, so we can use the arrow-body-style rule
  // eslint-disable-next-line arrow-body-style
  OrganizationLogo.resumable.on('fileAdded', (file) => OrganizationLogo.insert({
    _id: file.uniqueIdentifier,
    filename: file.fileName,
    contentType: file.file.type,
  }, (err) => {
    if (err) {
      // Create & show a message about failed insert
      const message = `${TAPi18n.__('organizationLogo_resumable_errorText')} ${err}`;
      sAlert.error(message, { timeout: 'none' });
      return;
    }

    // Get organization
    const organization = Organizations.findOne();
    // If user doesn't have permission to insert logo
    if (organization && !organization.currentUserCanManage()) {
      // Create & show error message about permissions
      const message = TAPi18n.__('organizationLogo_noPermissions');
      sAlert.error(message, { timeout: 'none' });
      return;
    }

    // Accepted extensions for images
    const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
      // Upload organization logo
      // TODO: refactor this code, so we can use the consistent-return rule
      // eslint-disable-next-line consistent-return
      return OrganizationLogo.resumable.upload();
    }

    /** Otherwise **/

    /* Step 1: Inform user about error */

    // Get error message translation related to accepted extensions
    const message = TAPi18n.__('organizationLogo_resumable_acceptedExtensions');
    // Alert user of error
    sAlert.error(message, { timeout: 'none' });

    /* Step 2: Remove uploaded file that was NOT image */

    // Get the id from Organization logo file object
    const organizationLogoFileId = file.uniqueIdentifier;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(organizationLogoFileId);

    // Remove Organization logo object
    OrganizationLogo.remove(objectId);
  }));
});
