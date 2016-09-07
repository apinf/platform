import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';

Template.navbar.onCreated(function () {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
});


Template.navbar.helpers({
  profileImageUrl () {
    // get a object with profile image url
    const profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  'isSearchRoute': function () {
    // Get name of current route from Router
    const routeName = Router.current().route.getName();

    if (routeName === 'search') {
      return true;
    } else {
      return false;
    }
  },
  uploadedProjectLogoLink () {
    // Check for existing branding
    const branding = Branding.findOne();

    // Make sure branding and project logo exist
    if (branding && branding.projectLogoFileId) {
      const currentProjectLogoFileId = Branding.findOne().projectLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(currentProjectLogoFileId);

      // Get project logo file Object
      const currentProjectLogoFile = ProjectLogo.findOne(objectId);

      // Check if project logo file is available
      if (currentProjectLogoFile) {
        // Get API logo file URL
        return Meteor.absoluteUrl().slice(0, -1) + ProjectLogo.baseURL + '/md5/' + currentProjectLogoFile.md5;
      }
    }
  },
  projectLogoExists () {
    // Get branding if it exists
    const branding = Branding.findOne();

    // Check if branding and project logo file ID exist
    if (branding && branding.projectLogoFileId) {
      return true;
    }
  },
});

Template.navbar.onRendered(function () {
  $('.icon-search').click(function () {
    $('.searchblock-toggle').slideToggle('fast');
    $('.toggle-search-icon').toggle();
    $('#search-text').focus();
  });
});
