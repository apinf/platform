Meteor.publish('projectLogo', function() {
  // Get branding document
  let branding = Branding.findOne();

  try {
    // Get project logo ID
    let projectLogoId = branding.projectLogoId;

    if (projectLogoId) {
      // Get ProjectLogo collection object
      return BrandingFiles.find(projectLogoId);
    }
  } catch(err) {
    console.log(err);
  }
});

Meteor.publish('coverPhoto', function() {
  // Get branding document
  let branding = Branding.findOne();

  try {
    // Get project logo ID
    let coverPhotoId = branding.coverPhotoId;

    if (coverPhotoId) {
      // Get ProjectLogo collection object
      return BrandingFiles.find(coverPhotoId);
    }
  } catch(err) {
    console.log(err);
  }
});

Meteor.publish('branding', function() {
  // Get Branding collection object
  let branding = Branding.find({});

  return branding;
});
