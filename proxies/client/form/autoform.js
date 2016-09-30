import { Meteor } from 'meteor/meteor';

AutoForm.addHooks('proxyForm', {
  onSuccess (formType, result) {
    // Hide modal
    Modal.hide('addProxy');

    Meteor.call('syncApiBackends');
  },
  onError (formType, error) {
    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  },
});
