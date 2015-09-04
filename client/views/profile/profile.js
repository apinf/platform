AutoForm.hooks({
  updateProfile: {
    onSuccess: function(operation, result, template) {
      return sAlert.success('Profile updated');
    },
    onError: function(operation, error, template) {
      return sAlert.error(error);
    }
  }
});
