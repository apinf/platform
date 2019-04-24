/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { TAPi18n } from 'meteor/tap:i18n';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import Settings from '/apinf_packages/settings/collection';

Template.settings.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('settingsPage_title_settings');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });
  // Subscription to feedback collection
  instance.subscribe('settings');
});

Template.settings.onRendered(() => {
  // Initialize all popovers on a page
  $('[data-toggle="popover"]').popover();
});

Template.settings.helpers({
  settingsCollection () {
    // Return reference to Settings collection, for AutoForm
    return Settings;
  },
  formType () {
    if (Settings.findOne()) {
      // Updating existing Settings
      return 'update';
    }
    // Editing Settings
    return 'insert';
  },
  editDoc () {
    return Settings.findOne();
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
