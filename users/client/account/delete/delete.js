import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.deleteAccount.events({
  'click #delete-account-confirm': function () {
    // Get user ID
    const userId = Meteor.userId();

    // Delete user account
    Meteor.call('deleteAccount', userId, function () {
      // Dismiss the delete account modal
      Modal.hide('deleteAccount');

      // Route to home page
      Router.go('home');
    });
  },
});
