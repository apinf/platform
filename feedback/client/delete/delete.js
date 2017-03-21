/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.deleteFeedbackItem.events({
  'click #confirm-delete': function () {
    // Get Feedback Item ID
    const feedbackItemId = Template.currentData().feedbackItem._id;

    // Call deleteFeedback method
    Meteor.call('deleteFeedback', feedbackItemId);

    // Close modal
    Modal.hide('deleteFeedbackItem');
  },
});
