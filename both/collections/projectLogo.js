ProjectLogo = new FS.Collection("projectLogo", {
  stores: [
    new FS.Store.GridFS("projectLogo")
  ]
});

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
