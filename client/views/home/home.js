Template.home.created = function () {
  // Get reference to template instance
  const instance = this;

  // Subscription to branding collection
  instance.subscribe('branding');
  // Subscription to projectLogo collection
  instance.subscribe('projectLogo');
  // Subscription to coverPhoto collection
  instance.subscribe('coverPhoto');

  // Run this each time something changes
  instance.autorun(function () {
    // Check for template subscriptions
    if (instance.subscriptionsReady) {
      // Get Branding collection content
      var branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        var title = branding.siteTitle;
        DocHead.setTitle(title);
      }
    }
  });
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
