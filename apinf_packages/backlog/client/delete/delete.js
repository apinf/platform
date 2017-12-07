/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import ApiBacklogItems from '../../collection';

Template.deleteBacklogItem.events({
  'click #confirm-delete': function () {
    // Get Backlog Item ID
    const backlogItemId = Template.currentData().backlogItem._id;

    // Remove the Backlog Item
    ApiBacklogItems.remove(backlogItemId);

    // Close the modal
    Modal.hide('deleteBacklogItem');

    // Get message text & display
    const message = TAPi18n.__('deleteBacklogItem_message_backlogRemoved');
    sAlert.success(message);
  },
});
