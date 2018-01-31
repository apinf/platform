/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import '/apinf_packages/feedback/client/list/list.html';
import Feedback from '../../collection';

Template.feedbackList.helpers({
  userFeedback () {
    return Feedback.find();
  },
  haveFeedback () {
    // Count user's feedback in feedback collection
    const feedbackCount = Feedback.find().count();
    return feedbackCount > 0;
  },
});

Template.feedbackList.events({
  // Delete feedback
  'click .delete-feedback': function () {
    Meteor.call('deleteFeedback', this._id);
  },
  'click #add-feedback': function () {
    Modal.show('feedbackForm');
  },
});
