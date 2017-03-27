/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.organizationRemoveManagers.events({
  'click #confirm-remove': function (event, templateInstance) {
    // Get organization ID
    const organizationId = templateInstance.data.organization._id;

    // Get User ID
    const userId = templateInstance.data.user._id;

    // Remove user from organization managers
    Meteor.call('removeOrganizationManager', organizationId, userId);

    // Dismiss the modal dialogue
    Modal.hide('organizationRemoveManagers');
  },
});
