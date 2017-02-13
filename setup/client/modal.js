import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Template } from 'meteor/templating';

Template.setupNeededModal.events({
  'click a': function () {
    // Hide the modal on click
    Modal.hide('setupNeededModal');
  },
});
