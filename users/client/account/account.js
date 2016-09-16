Template.account.events({
  'click .js-delete-account': function () {
    // Delete user account
    Meteor.call('deleteAccount', Meteor.userId());

    // Route to home page
    Router.go('home');
  },
});
