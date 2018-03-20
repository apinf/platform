/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import ProjectLogo from '/apinf_packages/branding/logo/collection';
import Settings from '/apinf_packages/settings/collection';

Template.navbar.onCreated(function () {
  const templateInstance = this;
  // Subscribe to project logo
  templateInstance.subscribe('projectLogo');
  templateInstance.subscribe('proxyCount');
  templateInstance.subscribe('emqProxyCount');

  templateInstance.autorun(() => {
    // Check if user is logged in
    if (Meteor.userId()) {
      // If user logged in, subscribe to Access setting
      templateInstance.subscribe('singleSetting', 'access');
    }
  });
});

Template.navbar.onRendered(() => {
  const branding = Branding.findOne();
  if (branding && branding.analyticCode) {
    // Create Script tag with src and type
    const script = $('<script>', {
      type: 'text/javascript',
      src: 'https://www.googletagmanager.com/gtag/js?id=${branding.analyticCode}',
    });
    $('body').append(script);

    // For google analytic data
    $('body').append(`<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${branding.analyticCode}');
    </script>`);
  }
});

Template.navbar.helpers({
  isSearchRoute () {
    // Get name of current route from Router
    const routeName = FlowRouter.getRouteName();

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
        return `${Meteor.absoluteUrl().slice(0, -1) +
        ProjectLogo.baseURL}/md5/${projectLogoFile.md5}`;
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
    // Get settigns document
    const settings = Settings.findOne();

    if (settings) {
      // Get access setting value
      // If access field doesn't exist, these is false. Allow users to add an API on default
      const onlyAdminsCanAddApis = settings.access ? settings.access.onlyAdminsCanAddApis : false;

      // Allow user to add an API because not only for admin
      if (!onlyAdminsCanAddApis) {
        return true;
      }

      // Otherwise check of user role
      // Get current user Id
      const userId = Meteor.userId();

      // Check if current user is admin
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      return userIsAdmin;
    }
    // Return true because no settings are set
    // By default allowing all user to add an API
    return true;
  },
  userCanViewDashboard () {
    // Allow or not regular user to view Dashboard page
    // It depends on onlyAdminsCanAddApis settings

    // Get settigns document
    const settings = Settings.findOne();

    if (settings) {
      // Get access setting value
      // If access field doesn't exist, these is false. Allow users to view page
      const onlyAdminsCanAddApis = settings.access ? settings.access.onlyAdminsCanAddApis : false;

      // Allow user to view page because not only for admin
      if (!onlyAdminsCanAddApis) {
        return true;
      }

      // Otherwise check of user role
      // Get current user Id
      const userId = Meteor.userId();

      // Check if current user is admin or manager
      const userIsAdminOrManager = Roles.userIsInRole(userId, ['admin', 'manager']);

      return userIsAdminOrManager;
    }
    // Return true because no settings are set
    // By default allowing all user to add an API
    return true;
  },
  userCanViewMqttDashboard () {
    // Get current user Id
    const userId = Meteor.userId();
    // User is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Get count of EMQ Proxies
    const proxyCount = Counts.get('emqProxyCount');

    // Can view if he is Admin and Emq Proxy is defined
    return userIsAdmin && proxyCount > 0;
  },
});

Template.navbar.events({
  'click .icon-search': function () {
    // Show/hide search field
    $('.searchblock-toggle').slideToggle('fast');

    // Toggle search icon
    $('.toggle-search-icon').toggle();

    // Set cursor to search field
    $('#search-text').focus();
  },
  'click #dashboard-button': function () {
    // Redirect to Dashboard
    FlowRouter.go('dashboardPage');
  },
});
