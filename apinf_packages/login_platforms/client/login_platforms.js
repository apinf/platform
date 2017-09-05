/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import LoginPlatforms from '/apinf_packages/login_platforms/collection';

Template.loginPlatforms.onCreated(function () {
  // Subscription to feedback collection
  this.subscribe('login-platforms');
});

Template.loginPlatforms.onRendered(() => {
  // Initialize all popovers on a page
  $('[data-toggle="popover"]').popover();
});

Template.loginPlatforms.helpers({
  settingsCollection () {
    // Return reference to Settings collection, for AutoForm
    return LoginPlatforms;
  },
  formType () {
    if (LoginPlatforms.findOne()) {
      // Updating existing Settings
      return 'update';
    }
    // Editing Settings
    return 'insert';
  },
  editDoc () {
    return LoginPlatforms.findOne();
  },
});
