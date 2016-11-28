import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import { OrganizationLogo } from '/organizations/logo/collection/collection';
import { Organizations } from '/organizations/collection';
import { fileNameEndsWith } from '/core/helper_functions/file_name_ends_with';

Meteor.startup(function () {
  OrganizationLogo.resumable.on('fileAdded', function (file) {
    return OrganizationLogo.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
    }, function (err, organizationLogoFile) {
      if (err) {
        console.warn('File creation failed!', err);
        return;
      }

      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Get the id from Organization logo file object
        const organizationLogoFileId = file.uniqueIdentifier;

        // Get organization id
        const organization = Organizations.findOne();

        // Update logo id field
        Organizations.update(organization._id, { $set: { organizationLogoFileId } });

        // Get success message translation
        const message = TAPi18n.__('organizationLogo_resumable_successfully_uploaded');

        sAlert.success(message);

        return OrganizationLogo.resumable.upload();
      } else {
        // Get error message translation related to accepted extensions
        const message = TAPi18n.__('organizationLogo_resumable_acceptedExtensions');

        // Alert user of error
        sAlert.error(message);
      }
    });
  });
});
