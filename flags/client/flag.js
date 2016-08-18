Template.flagApiModal.onCreated(function () {

  // Create reference to instance
  const instance = this;

  // Get apiFlag doc passed to a template
  instance.apiFlag = instance.data.apiFlag;
});

Template.flagApiModal.helpers({
  formType () {

    // Create reference to instance
    const instance = Template.instance();

    // Check if apiFlag exists are return related form action
    return (instance.apiFlag) ? 'update' : 'insert';
  },
  apiFlag () {

    // Create reference to instance
    const instance = Template.instance();

    return instance.apiFlag;
  },
  apiIsFlagged () {

    // Create reference to instance
    const instance = Template.instance();

    // Check if api exists and return boolean
    return (instance.apiFlag) ? true : false;
  }
});

Template.flagApiModal.events({
  'click #remove-apiFlag': function () {

    // Create reference to instance
    const instance = Template.instance();

    // Remove ApiFlag and keep response
    const removeApiFlag = ApiFlags.remove({ _id: instance.apiFlag._id });

    // Check if document has been removed
    if (removeApiFlag > 0) {

      // Show message to a user
      sAlert.success(TAPi18n.__('flagApiModal_removeApiFlag_successMessage'));

      // Hide modal
      Modal.hide('flagApiModal');
    }
  }
});
