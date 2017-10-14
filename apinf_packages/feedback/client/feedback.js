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

// Collection imports
import Feedback from '../collection';

Template.apiFeedback.helpers({
  checkAllPublic () {
    // Fetch count of feedbacks
    const feedbackCount = Feedback.find().count();

    // Fetch count of feedbacks as public
    const publicFeedbackCount = Feedback.find({ isPublic: true }).count();
    if (feedbackCount === publicFeedbackCount) {
      return true;
    }
    return false;
  },
});

Template.apiFeedback.events({
  'click #add-feedback': function () {
    // Show feedbackForm modal
    Modal.show('feedbackForm', { formType: 'insert' });
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
