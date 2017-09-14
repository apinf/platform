/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.apiFeedback.events({
  'click #add-feedback': function () {
    // Show feedbackForm modal
    Modal.show('feedbackForm', { formType: 'insert' });
  },

  'click #mark-all-feedbacks-as-private': () => {
    Modal.show('changeFeedbackVisibility', { toPublic: false });
  },

  'click #mark-all-feedbacks-as-public': () => {
    Modal.show('changeFeedbackVisibility', { toPublic: true });
  },
});
