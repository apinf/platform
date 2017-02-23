import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Close modal after successful insert/update
AutoForm.addHooks('apiMediaPostsForm', {
  onSuccess () {
    Modal.hide('apiMediaPostsForm');
    // Quick and dirty solution, to be fixed later
    // Because after updating URL, the oembed does not refresh
    // Using flow-router, a refresh is called
    const context = FlowRouter.current();
    FlowRouter.go('/');
    FlowRouter.go(context.path);
  },
});
