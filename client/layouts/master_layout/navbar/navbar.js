Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  }
})
