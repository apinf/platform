AutoForm.hooks({
  updatePassword: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var instance = this;
      Accounts.changePassword(insertDoc.old, insertDoc.new, function(e) {
        $('.btn-primary').attr('disabled', null);
        if (e) {
          // Alert the user of failure
          sAlert.error(e.message);
          instance.done(e.message);
        } else {
          // Alert the user of success
          sAlert.success('Password Updated');
          instance.done('Password Updated');
          // Clear the form
          AutoForm.resetForm('updatePassword');
        }
      });
      return true;
    }
  }
});

Template.account.events({
  'click .js-delete-account': function() {
    return Meteor.call('deleteAccount', Meteor.userId());
  }
});

Template.setUserName.helpers({
  user: function() {
    return Meteor.user();
  }
});
