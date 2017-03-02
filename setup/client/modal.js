// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.setupNeededModal.events({
  'click a': function () {
    // Hide the modal on click
    Modal.hide('setupNeededModal');
  },
});
