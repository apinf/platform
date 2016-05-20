Template.branding.created = function () {
  var instance = this;
  // Subscription to branding collection
  instance.subscribe('branding');
  // Subscribe to project logo collection
  instance.subscribe('projectLogo');
  // Subscription to coverPhoto collection
  instance.subscribe('coverPhoto');
};

Template.branding.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
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
