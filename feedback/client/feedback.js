// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.apiFeedback.events({
  'click #add-feedback': function () {
    // Show feedbackForm modal
    Modal.show('feedbackForm', { formType: 'insert' });
  },
});
