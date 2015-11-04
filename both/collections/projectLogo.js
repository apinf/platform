ProjectLogo = new FS.Collection("projectLogo", {
  // TODO: Determine how to upload files within the project directory
  // without hardcoding FS path
  stores: [
    new FS.Store.GridFS("projectLogo")
  ],
});

if (Meteor.isServer) {
  ProjectLogo.allow({
    insert: function(userId, doc) {
      return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
      return true;
    },
    download: function(userId) {
      return true;
    }
  });
}
