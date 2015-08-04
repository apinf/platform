AutoForm.hooks({
  updatePassword: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      if (insertDoc["new"] !== insertDoc.confirm) {
        sAlert.error('Passwords do not match');
        return false;
      }
      Accounts.changePassword(insertDoc.old, insertDoc["new"], function(e) {
        $('.btn-primary').attr('disabled', null);
        if (e) {
          return sAlert.error(e.message);
        } else {
          return sAlert.success('Password Updated');
        }
      });
      return false;
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
