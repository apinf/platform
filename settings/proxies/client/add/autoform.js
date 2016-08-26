AutoForm.addHooks('addProxy', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('addProxy');

  },
  onError (formType, error) {

    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  }
});
