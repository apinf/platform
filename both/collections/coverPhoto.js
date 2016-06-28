CoverPhoto = new FS.Collection("coverPhoto", {
  stores: [
    new FS.Store.GridFS("coverPhoto")
  ]
});

CoverPhoto.filters({
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
  CoverPhoto.allow({
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
