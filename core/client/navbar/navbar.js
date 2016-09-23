import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Proxies } from '/proxies/collection';
import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';

Template.navbar.onCreated(function () {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  instance.subscribe('proxyCount');
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
      const projectLogoFileId = branding.projectLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(projectLogoFileId);

      // Get project logo file Object
      const projectLogoFile = ProjectLogo.findOne(objectId);

      // Check if project logo file is available
      if (projectLogoFile) {
        // Get API logo file URL
        return Meteor.absoluteUrl().slice(0, -1) + ProjectLogo.baseURL + '/md5/' + projectLogoFile.md5;
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
  proxyIsDefined () {
    // Get count of Proxies
    const proxyCount = Counts.get('proxyCount');

    // Check that a proxy is defined
    if (proxyCount > 0) {
      // Proxy is defined
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
