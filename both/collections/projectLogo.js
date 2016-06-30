ProjectLogo = new FS.Collection("projectLogo", {
  stores: [
    new FS.Store.GridFS("projectLogo")
  ]
});

ProjectLogo.filters({
  allow: {
    maxSize: 10048567, // ~ 10Mbs.
    extensions: ['jpg', 'jpeg', 'png', 'gif']
  },
  onInvalid: function (message) {
    // Show error message if it doesn't pass filter settings
    FlashMessages.sendError(message);
  }
});

if (Meteor.isServer) {
  ProjectLogo.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    download: function() {
      return true;
    },
    remove: function() {
      return true;
    }
  });
}
