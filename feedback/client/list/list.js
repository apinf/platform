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
import Feedback from '../../collection';

Template.feedbackList.onCreated(function () {
  // Get API Backend ID from URL route
  const apiId = this.data.api._id;

  // Subscribe for all feedback for this API Backend
  this.subscribe('apiBackendFeedback', apiId);
});

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
