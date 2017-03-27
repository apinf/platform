/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// In multi-proxy case: change early selected and saved proxy to current selected
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
