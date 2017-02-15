
Template.goBackButton.events({
  'click #go-back': function () {
    // Go back one page in the browser history
    history.back();
  },
});
