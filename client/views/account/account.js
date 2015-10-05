AutoForm.hooks({
  updatePassword: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var instance = this;
      Accounts.changePassword(insertDoc.old, insertDoc.new, function(e) {
        $('.btn-primary').attr('disabled', null);
        if (e) {
          sAlert.error(e.message);
          instance.done(e.message);
        } else {
          sAlert.success('Password Updated');
          instance.done('Password Updated');
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
