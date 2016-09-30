import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.addHooks('proxyForm', {
  onSuccess () {
    // Hide modal
    Modal.hide('addProxy');

    Meteor.call('syncApiBackends');
  },
  onError (formType, error) {
    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  },
});
