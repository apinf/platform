import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Proxies } from '/proxies/collection';
import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';

Template.navbar.onCreated(function () {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  instance.subscribe('publicProxyDetails');
});


Template.navbar.helpers({
  profileImageUrl () {
    // get a object with profile image url
    const profilePicture = ProfilePictures.findOne({});
    // return that url
    return profilePicture.url();
  },
  isSearchRoute () {
    // Get name of current route from Router
    const routeName = Router.current().route.getName();

    if (routeName === 'search') {
      return true;
    } else {
      return false;
    }
  },
  uploadedProjectLogoLink () {
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

    return '';
  },
  projectLogoExists () {
    const branding = Branding.findOne();
    if (branding) {
      const currentProjectLogoFileId = branding.projectLogoFileId;
      return true;
    }

    return false;
  },
  proxyIsDefined () {
    return (Proxies.findOne()) ? true : false;
  },
});

Template.navbar.onRendered(function () {
  $('.icon-search').click(() => {
    $('.searchblock-toggle').slideToggle('fast');
    $('.toggle-search-icon').toggle();
    $('#search-text').focus();
  });
});
