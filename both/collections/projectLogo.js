ProjectLogo = new FS.Collection("projectLogo", {
  stores: [
    new FS.Store.GridFS("projectLogo")
  ]
});

if (Meteor.isServer) {
  ProjectLogo.allow({
    insert: function(userId, doc) {
      return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fieldNames, modifier) {
      return Roles.userIsInRole(userId, ['admin']);
    },
    download: function(userId) {
      return true;
    },
    remove: function() {
      return true;
    }
  });
}
