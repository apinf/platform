// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  apiBacklogItemForm: {
    before: {
      insert (backlogItem) {
        // Attach API Backend Id to backlog item
        backlogItem.apiBackendId = FlowRouter.getParam('_id');
        return backlogItem;
      },
    },
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr('disabled', 'disabled');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr('disabled');
    },
    onSuccess () {
      // Hide apiBacklogItemForm modal
      Modal.hide('apiBacklogItemForm');
    },
  },
});
