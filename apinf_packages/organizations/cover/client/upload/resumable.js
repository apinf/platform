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
import OrganizationCover from '/organizations/cover/collection/collection';
import Organizations from '/organizations/collection';

// APInf imports
import fileNameEndsWith from '/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  // Set organization cover id to organization collection on success
  OrganizationCover.resumable.on('fileSuccess', (file) => {
    // Get slug
    const slug = FlowRouter.getParam('slug');

    // Get organization by slug
    const organization = Organizations.findOne({ slug });

    /* Step 1: Remove existing organization cover */

    // Get organization documentationFileId
    const organizationCoverFileId = organization.organizationCoverFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

    // Remove Organization cover object
    OrganizationCover.remove(objectId);

    /* Step 2: Update new organization cover */

    // Get the id from Organization cover file object
    const newOrganizationCoverFileId = file.uniqueIdentifier;

    // Update cover id field
    Organizations.update(
      organization._id,
      { $set: { organizationCoverFileId: newOrganizationCoverFileId } }
    );

    // Get success message translation
    const message = 'Successfully uploaded.';

    sAlert.success(message);
  });

  // eslint-disable-next-line arrow-body-style
  OrganizationCover.resumable.on('fileAdded', (file) => OrganizationCover.insert({
    _id: file.uniqueIdentifier,
    filename: file.fileName,
    contentType: file.file.type,
  }, (err) => {
    if (err) {
      // Create & show a message about failed insert
      const message = `${TAPi18n.__('organizationCover_resumable_errorText')} ${err}`;
      sAlert.error(message);
      return;
    }

    // Get organization
    const organization = Organizations.findOne();

    // If user doesn't have permission to insert cover
    if (organization && !organization.currentUserCanManage()) {
      // Create & show error message about permissions
      const message = TAPi18n.__('organizationCover_noPermissions');
      sAlert.error(message);
      return;
    }

    // Accepted extensions for images
    const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
      // Upload organization cover
      // TODO: refactor this code, so we can use the consistent-return rule
      // eslint-disable-next-line consistent-return
      return OrganizationCover.resumable.upload();
    }

    /** Otherwise **/

    /* Step 1: Inform user about error */

    // Get error message translation related to accepted extensions
    const message = TAPi18n.__('organizationCover_resumable_acceptedExtensions');
    // Alert user of error
    sAlert.error(message);

    /* Step 2: Remove uploaded file that was NOT image */

    // Get the id from Organization cover file object
    const organizationCoverFileId = file.uniqueIdentifier;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

    // Remove Organization cover object
    OrganizationCover.remove(objectId);
  }));
});
