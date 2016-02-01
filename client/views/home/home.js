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
