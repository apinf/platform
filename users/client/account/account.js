Template.account.events({
  'click .js-delete-account': function () {
    return Meteor.call('deleteAccount', Meteor.userId());
  },
});
