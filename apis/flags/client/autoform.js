AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {

    // Hide modal
    Modal.hide('flagApiModal');

    // Checks formtype
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
    return new Meteor.Error(error);
  }
});
