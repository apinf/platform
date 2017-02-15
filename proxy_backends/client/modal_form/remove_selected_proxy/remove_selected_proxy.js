// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// In multi-proxy case:
// Change early selected and saved proxy to first position in dropdown list 'Select proxy'
Template.removeSelectedProxy.events({
  'click #confirm-remove-selected-proxy': function (event, templateInstance) {
    // Get template reference of proxyBackend
    const proxyBackend = templateInstance.data.proxyBackend;
    // Update proxy id
    proxyBackend.data.proxyId.set('');
    // Hide modal form
    Modal.hide('removeSelectedProxy');
  },
  'click #cancel-remove-selected-proxy': function (event, templateInstance) {
    // Get event reference of select tag
    const proxyBackendEvent = templateInstance.data.proxyBackendEvent;
    // Get template reference of proxyBackend
    const proxyBackend = templateInstance.data.proxyBackend;
    // Don't let to change optionwhen user canceled his chose
    proxyBackendEvent.target.options.selectedIndex = proxyBackend.previousItemNumber;
    // Hide modal form
    Modal.hide('removeSelectedProxy');
  },
});
