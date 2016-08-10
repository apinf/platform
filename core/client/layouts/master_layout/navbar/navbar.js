import { ProjectLogo } from '/logo/collection/collection';

Template.navbar.onCreated(function() {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
});


Template.navbar.helpers({
  profileImageUrl: function() {
    // get a object with profile image url
    var profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  "isSearchRoute": function () {
    // Get name of current route from Router
    var routeName = Router.current().route.getName();

    if (routeName === "search") {
      return true;
    } else {
      return false;
    }
  },
  uploadedProjectLogoLink: function() {

    const currentProjectLogoFileId = Branding.findOne().projectLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentProjectLogoFileId);

    // Get project logo file Object
    const currentProjectLogoFile = ProjectLogo.findOne(objectId);

    // Check if project logo file is available
    if (currentProjectLogoFile) {
      // Get API logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + ProjectLogo.baseURL + "/md5/" + currentProjectLogoFile.md5;
    }
  },
  projectLogoExists: function () {
    const branding = Branding.findOne();

    if (branding.projectLogoFileId) {
      return true;
    }
  }
});

Template.navbar.onRendered(function() {
  $('.icon-search').click(function() {
    $('.searchblock-toggle').slideToggle("fast");
    $('.toggle-search-icon').toggle();
    $('#search-text').focus();
  });
});
