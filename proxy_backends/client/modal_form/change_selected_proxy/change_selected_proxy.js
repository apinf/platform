// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// In multi-proxy case: change early selected and saved proxy to current selected
Template.changeSelectedProxy.events({
  'click #confirm-change-selected-proxy': function (event, templateInstance) {
    // Get template reference of proxyBackend & selected item
    const proxyBackend = templateInstance.data.proxyBackend;
    const selectedItem = templateInstance.data.selectedItem;
    // Update proxy id
    proxyBackend.data.proxyId.set(selectedItem);
    // Hide modal form
    Modal.hide('changeSelectedProxy');
  },
  'click #cancel-change-selected-proxy': function (event, templateInstance) {
    // Get event reference of select tag
    const proxyBackendEvent = templateInstance.data.proxyBackendEvent;
    // Get template reference of proxyBackend
    const proxyBackend = templateInstance.data.proxyBackend;
    // Don't let to change option when user canceled his chose
    proxyBackendEvent.target.options.selectedIndex = proxyBackend.previousItemNumber;
    // Hide modal form
    Modal.hide('changeSelectedProxy');
  },
});
