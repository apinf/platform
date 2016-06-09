Template.flagApiButton.onCreated(function () {

  const instance = this;

  const apiBackendId = instance.data.apiBackendId;

})

Template.flagApiButton.events({
  'click #openFlagApiModal': function () {

    // Show modal
    Modal.show('flagApiModal');
  }
})
