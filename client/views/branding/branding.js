Template.branding.created = function () {
  var instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');
  // Subscribe to project logo collection
  // instance.subscribe('projectLogo');
  // // Subscription to coverPhoto collection
  // instance.subscribe('coverPhoto');
};

Template.branding.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  // },
  // projectLogo: function () {
  //   // Get last uploaded image from collection
  //   var lastUploadedLogo = ProjectLogo.findOne({}, {sort: {uploadedAt: -1}});
  //   // Check if new logo was uploaded, if so change it with previous
  //   if (lastUploadedLogo) {
  //     return lastUploadedLogo
  //   }
  // },
  // coverPhoto: function () {
  //   // Get last uploaded image from collection
  //   var lastUploadedCover = CoverPhoto.findOne({}, {sort: {uploadedAt: -1}});
  //   // Check if new cover was uploaded, if so change it with previous
  //   if (lastUploadedCover) {
  //     return lastUploadedCover;
  //   }
  }
});
