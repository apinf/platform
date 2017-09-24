/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.changeFeedbackVisibility.events({
  'click #confirm-change-visibility': () => {
    // Get template instance
    const instance = Template.instance();

    // Get slug
    const slug = FlowRouter.getParam('slug');

    // Change the visibility of all api's feedbacks
    Meteor.call('changeAllFeedbacksVisibility', slug, instance.data.toPublic);

    // Close modal
    Modal.hide('changeFeedbackVisibility');
  },
});
