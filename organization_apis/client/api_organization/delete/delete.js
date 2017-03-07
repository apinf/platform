// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import ApiMetadata from '/metadata/collection';
import OrganizationApis from '../../../collection';

Template.deleteOrganizationApiConfirmation.events({
  'click #delete-api-organization': function (event, templateInstance) {
    // Get Organization API ID from template instance
    const organizationApiId = templateInstance.data.organizationApi._id;

    // Remove the Organization API link, by ID since code is untrusted
    OrganizationApis.remove(organizationApiId);

    // Get ID of current API
    const apiId = templateInstance.data.organizationApi.apiId;
    // Get the API Metadata document
    const apiMetadata = ApiMetadata.findOne({ apiId });

    // Make sure apiMetadata document exists
    if (apiMetadata) {
      // Make sure apiMetadata has contact or service information
      if (apiMetadata.contact || apiMetadata.service) {
        // Then just unset organizationId value
        ApiMetadata.update(apiMetadata._id, { $unset: { organizationId: '' } });
      } else {
        // Otherwise delete all apiMetadata document
        ApiMetadata.remove(apiMetadata._id);
      }
    }

    // Dismiss the confirmation dialogue
    Modal.hide('deleteOrganizationApiConfirmation');

    // Get success message translation
    const message = TAPi18n.__('deleteOrganizationApiConfirmation_success_message');

    sAlert.success(message);
  },
});
