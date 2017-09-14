/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import LoginPlatforms from '../collection';

Template.loginPlatforms.onCreated(function () {
  // Subscription to feedback collection
  this.subscribe('loginPlatforms');
});

Template.loginPlatforms.helpers({
  loginPlatformsCollection () {
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
