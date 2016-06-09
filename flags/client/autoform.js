AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('flagApiModal');

    // Show message to a user
    sAlert.success('API has been successfully flagged!');

  },
  onError (formType, error) {

    // Throw an error if one has been chatched
    throw new Meteor.Error(error);
  }
})
