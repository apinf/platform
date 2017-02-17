import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Template } from 'meteor/templating';

Template.account.events({
  'click #delete-account-button': function () {
    // Show the delete account modal
    Modal.show('deleteAccount');
  },
});
