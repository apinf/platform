AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('flagApiModal');

    if (formType === 'insert') {

      // Show message to a user
      sAlert.success('API has been successfully flagged!');
      
    } else if (formType === 'update') {

      // Show message to a user
      sAlert.success('API flag info has been successfully updated!');
    }

  },
  onError (formType, error) {

    // Throw an error if one has been chatched
    throw new Meteor.Error(error);
  }
})
