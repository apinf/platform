AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('flagApiModal');
    
  },
  onError (formType, error) {

    // Throw an error if one has been chatched
    throw new Meteor.Error(error);
  }
})
