AutoForm.hooks({
  updateProfile: {
    before: {
      update: function(doc){

        if (Meteor.call("usernameExists", doc))
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
