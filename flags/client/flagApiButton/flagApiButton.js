Template.flagApiButton.onCreated(function () {

  const instance = this;

  const apiBackendId = instance.data.apiBackend._id;

  console.log(apiBackendId)

  instance.apiFlag = new ReactiveVar();

  instance.subscribe('singleApiFlag', apiBackendId);

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.apiFlag.set(ApiFlags.findOne({ apiBackendId }));
    }
  });

})

Template.flagApiButton.events({
  'click #openFlagApiModal': function () {

    const instance = Template.instance();

    // Show modal
    Modal.show('flagApiModal', { apiFlag: instance.apiFlag.get() });
  }
})

Template.flagApiButton.helpers({
  apiIsFlagged () {
    const instance = Template.instance();

    const apiFlag = instance.apiFlag.get();

    return (apiFlag) ? true : false;
  }
})
