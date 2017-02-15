// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import OrganizationApis from '../../../collection';

Template.deleteOrganizationApiConfirmation.events({
  'click #delete-api-organization': function (event, templateInstance) {
    // Get Organization API ID from template instance
    const organizationApiId = templateInstance.data.organizationApi._id;

    // Remove the Organization API link, by ID since code is untrusted
    OrganizationApis.remove(organizationApiId);

    // Dismiss the confirmation dialogue
    Modal.hide('deleteOrganizationApiConfirmation');

    // Get success message translation
    const message = TAPi18n.__('deleteOrganizationApiConfirmation_success_message');

    sAlert.success(message);
  },
});
