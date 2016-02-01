Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
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
  "isSearchRoute": function () {
    // Get name of current route from Router
    var routeName = Router.current().route.getName();

    if (routeName === "search") {
      return true;
    } else {
      return false;
    }
  }
});
