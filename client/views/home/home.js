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
    let branding = Branding.findOne();

    if (branding) {
      return branding;
    }
  },
  projectLogo: function () {
    // Get branding document
    let branding = Branding.findOne();

    if (branding) {
      // Get project logo ID
      let projectLogoId = branding.projectLogoId;

      if (projectLogoId) {
        // Get project logo collection object
        return BrandingFiles.findOne(projectLogoId);
      }
    }
  },
  coverPhoto: function () {
    // Get branding document
    let branding = Branding.findOne();

    if (branding) {
      // Get project logo ID
      let coverPhotoId = branding.coverPhotoId;

      if (coverPhotoId) {
        // Get cover photo collection object
        return BrandingFiles.findOne(coverPhotoId);
      }
    }
  }
});
