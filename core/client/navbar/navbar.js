import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Router } from 'meteor/iron:router';
import { Roles } from 'meteor/alanning:roles';

import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';
import { Settings } from '/settings/collection';

import $ from 'jquery';

Template.navbar.onCreated(function () {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  instance.subscribe('proxyCount');
  instance.subscribe('singleSetting', 'onlyAdminsCanAddApis');
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
    }

    return false;
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
        return Meteor.absoluteUrl().slice(0, -1) +
        ProjectLogo.baseURL + '/md5/' + projectLogoFile.md5;
      }
    }

    return '';
  },
  projectLogoExists () {
    // Get branding if it exists
    const branding = Branding.findOne();

    // Check if branding and project logo file ID exist
    if (branding && branding.projectLogoFileId) {
      return true;
    }

    return false;
  },
  proxyIsDefined () {
    // Get count of Proxies
    const proxyCount = Counts.get('proxyCount');

    // Check that a proxy is defined
    if (proxyCount > 0) {
      // Proxy is defined
      return true;
    }

    return false;
  },
  userCanAddApi () {
    try {
      // Get settigns document
      const settings = Settings.findOne();

      // Get access setting value
      const onlyAdminsCanAddApis = settings.access.onlyAdminsCanAddApis;

      if (!onlyAdminsCanAddApis) {
        return true;
      }

      // Get current user Id
      const userId = Meteor.userId();

      // Check if current user is admin
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      return onlyAdminsCanAddApis && userIsAdmin;
    } catch (e) {
      // If caught an error, then returning true because no access settings is set
      // By default allowing all user to add an API
      return true;
    }
  },
});

Template.navbar.onRendered(() => {
  $('.icon-search').click(() => {
    $('.searchblock-toggle').slideToggle('fast');
    $('.toggle-search-icon').toggle();
    $('#search-text').focus();
  });
});

Template.navbar.events({
  'click #about-button': function () {
    // Show the 'about Apinf' modal
    Modal.show('aboutApinf');
  },
});
