// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.organizationSettingsDelete.events({
  // event handler to execute when delete API button is clicked
  'click #delete-organization': function () {
    const organization = this.organization;
    // Show modal form & pass organization document to modal form
    Modal.show('deleteOrganizationConfirmation', { organization });
  },
});
