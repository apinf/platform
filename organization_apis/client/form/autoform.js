// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import ApiMetadata from '/metadata/collection';
import OrganizationApis from '../../collection';

AutoForm.hooks({
  organizationApisForm: {
    onError (formType, error) {
      // Show error message to user
      sAlert.error(error.message);
    },
    onSuccess (formType, result) {
      // Get organizationApis document
      const organizationApis = OrganizationApis.findOne(result);
      // Get API ID
      const apiId = organizationApis.apiId;
      // Get API metadata document
      const apiMetadata = ApiMetadata.findOne({ apiId });

      // Make sure API metadata document exists
      if (apiMetadata) {
        // Then update document
        ApiMetadata.update(apiMetadata._id, { $set: { organizationId: '' } });
      } else {
        // Otherwise create a new one
        ApiMetadata.insert({ apiId, organizationId: organizationApis.organizationId });
      }

      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');

      // Show success message to user
      sAlert.success(message);

      // Dismiss connect API modal, if connecting API to Organization via modal
      Modal.hide('connectApiToOrganizationModal');
    },
  },
});
