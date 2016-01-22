Template.home.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscription to projectLogo collection
  this.subscribe('projectLogo');
  // Subscription to coverPhoto collection
  this.subscribe('coverPhoto');
};

Template.home.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  },
  projectLogo: function () {
    // Get last uploaded image from collection
    var lastUploadedLogo = ProjectLogo.findOne({}, {sort: {uploadedAt: -1}});
    // Check if new logo was uploaded, if so change it with previous
    if (lastUploadedLogo) {
      return lastUploadedLogo;
    }
  },
  coverPhoto: function () {
    // Get last uploaded image from collection
    var lastUploadedCover = CoverPhoto.findOne({}, {sort: {uploadedAt: -1}});
    // Check if new cover was uploaded, if so change it with previous
    if (lastUploadedCover) {
      return lastUploadedCover;
    }
  }
});
