AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType, result) {
    // Hide modal
    Modal.hide('flagApiModal');

    // Checks formtype
    if (formType === 'insert') {
      // Get insert message translation
      const message = TAPi18n.__('flagApiModal_removeApiFlag_insertMessage');

      // Show message to a user
      sAlert.success(message);
    } else if (formType === 'update') {
      // Get update message translation
      const message = TAPi18n.__('flagApiModal_removeApiFlag_updateMessage');

      // Show message to a user
      sAlert.success(message);
    }
  },
  onError (formType, error) {
    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  },
});
