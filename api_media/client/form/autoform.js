import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { AutoForm } from 'meteor/aldeed:autoform';

// Close modal after successful insert/update
AutoForm.addHooks('postsForm', {
  onSuccess () {
    Modal.hide('postInsertModal');
  },
});
