import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Close modal after successful insert/update
AutoForm.addHooks('apiMediaPostsForm', {
  onSuccess () {
    Modal.hide('postInsertModal');
    const context = FlowRouter.current();
    FlowRouter.go(context);
  },
});
