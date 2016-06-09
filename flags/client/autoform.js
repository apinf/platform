AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('flagApiModal');

    if (formType === 'insert') {

      // Show message to a user
      sAlert.success(TAPi18n.__('flagApiModal_removeApiFlag_insertMessage'));

    } else if (formType === 'update') {

      // Show message to a user
      sAlert.success(TAPi18n.__('flagApiModal_removeApiFlag_updateMessage'));
    }

  },
  onError (formType, error) {

    // Throw an error if one has been chatched
    throw new Meteor.Error(error);
  }
})
