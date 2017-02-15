// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.apiBacklog.events({
  'click #add-backlog-item': function () {
    // Show Add API Backlog Item modal
    Modal.show('apiBacklogItemForm', { formType: 'insert' });
  },
});
