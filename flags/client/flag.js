Template.flagApiModal.onCreated(function () {

  const instance = this;

  instance.apiFlag = instance.data.apiFlag;

});

Template.flagApiModal.helpers({
  formType () {

    const instance = Template.instance();

    return (instance.apiFlag) ? 'update' : 'insert';
  },
  apiFlag () {

    const instance = Template.instance();

    return instance.apiFlag;
  },
  apiIsFlagged () {
    const instance = Template.instance();

    return (instance.apiFlag) ? true : false;
  }
});

Template.flagApiModal.events({
  'click #remove-apiFlag': function () {

    const instance = Template.instance();

    const removeApiFlag = ApiFlags.remove({ _id: instance.apiFlag._id });

    if (removeApiFlag > 0) {

      sAlert.success('Flag has been successfully removed from API');

      Modal.hide('flagApiModal');
    }
  }
})
