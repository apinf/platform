/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Feedback from '../collection';

Template.apiFeedback.onCreated(function () {
  // Get IDs of feedbacks
  const feedbackIds = Feedback.find().map((feedback) => {
    return feedback._id;
  });

  // Subscribe to feedbacks comments
  this.subscribe('getEntitiesComments', feedbackIds);
  // Subscribe to usernames of comments authors
  this.subscribe('commentUsersUsername', feedbackIds);
});

Template.apiFeedback.helpers({
  checkFeedbackCount () {
    // Fetch count of feedbacks
    return Feedback.find().count();
  },
  checkAllPublic () {
    // Fetch count of feedbacks
    const feedbackCount = Feedback.find().count();

    // Fetch count of feedbacks as public
    const publicFeedbackCount = Feedback.find({ isPublic: true }).count();

    return feedbackCount === publicFeedbackCount;
  },
  isToolTip () {
    if (Meteor.userId()) {
      // Add tooltip for loged In users
      return TAPi18n.__('feedback_feedbackForm_withLogin_tooltip');
    }
    // Add tooltip for anonymous users
    return TAPi18n.__('feedback_feedbackForm_withoutLogin_tooltip');
  },
});

Template.apiFeedback.events({
  'click #add-feedback': function () {
    const userId = Meteor.userId();
    if (userId) {
      // Show feedbackForm modal
      Modal.show('feedbackForm', { formType: 'insert' });
    } else {
      // Redirect to login page
      FlowRouter.go('signIn');
    }
  },
  'click #mark-all-feedbacks-as-private': () => {
    // Get slug
    const slug = FlowRouter.getParam('slug');
    // Change the visibility of all api's feedbacks
    Meteor.call('changeAllFeedbacksVisibility', slug, false);
  },
  'click #mark-all-feedbacks-as-public': () => {
    // Get slug
    const slug = FlowRouter.getParam('slug');
    // Change the visibility of all api's feedbacks
    Meteor.call('changeAllFeedbacksVisibility', slug, true);
  },
});
