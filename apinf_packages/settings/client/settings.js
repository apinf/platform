/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

Template.settings.onCreated(function () {
  // Subscription to feedback collection
  this.subscribe('settings');
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
});
