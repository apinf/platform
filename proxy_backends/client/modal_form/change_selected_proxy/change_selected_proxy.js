// In multi-proxy case: change early selected and saved proxy to current selected

import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.changeSelectedProxy.events({
  'click #confirm-change-selected-proxy': function (event, templateInstance) {
    // Get template reference of proxyBackend
    const proxyBackendForm = templateInstance.data.proxyBackendForm;
    // Get selected option
    const selectedItem = templateInstance.data.selectedItem;

    // Update proxy id
    proxyBackendForm.proxyId.set(selectedItem);

    // Hide modal form
    Modal.hide('changeSelectedProxy');
  },
  'click #cancel-change-selected-proxy': function (event, templateInstance) {
    // Get event reference of select tag
    const proxyBackendEvent = templateInstance.data.proxyBackendEvent;

    // Don't let to change option when user canceled his choice
    // Set number of the previous selected option
    proxyBackendEvent.target.options.selectedIndex = templateInstance.data.previousItemNumber;

    // Hide modal form
    Modal.hide('changeSelectedProxy');
  },
});
