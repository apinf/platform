AutoForm.hooks({
  updateProfile: {
    onSuccess: function(operation, result, template) {
      return sAlert.success('Profile updated');
    },
    onError: function(operation, error, template) {
      return sAlert.error(error);
    }
  },
  updatePicture: {
    onSuccess: function(operation, result, template) {
      return sAlert.success('Picture Updated');
    },
    onError: function(operation, error, template) {
      return sAlert.error(error);
    }
  }
});

Template.profile.events({
  'change form#updatePicture input': function(e, t) {
    return Meteor.setTimeout(function() {
      return $('form#updatePicture').submit();
    }, 10);
  }
});
