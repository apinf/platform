Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  projectLogo: function () {
    var lastUploadedLogo = ProjectLogo.find({}, {sort: {uploadedAt: -1}}).fetch()[0];
    if (lastUploadedLogo) {
      return lastUploadedLogo
    }
  },
  projectLogoDefault: function () {
    // Count user's feedback in feedback collection
    var projectLogoCount  = ProjectLogo.find().count();
    return projectLogoCount > 0;
  }
})

