AutoForm.hooks({
  updateProfile: {
    before: {
      update: function(doc){
        var formUsername = AutoForm.getFieldValue('username', 'updateProfile');
         if (Meteor.call("usernameExists", formUsername))
          {
            sAlert.error("Username already taken");
            return false;
          }
          else
          {
            sAlert.success("Username successfully changed");
            return doc;
          }
        
      }
    }
  }
});
