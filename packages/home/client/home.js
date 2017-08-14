/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';

// Collection imports
import Branding from '/packages/branding/collection';

Template.home.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Run this each time something changes
  instance.autorun(() => {
    // Check for template subscriptions
    if (instance.subscriptionsReady) {
      // Get Branding collection content
      const branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        const title = branding.siteTitle;
        DocHead.setTitle(title);
      }
    }
  });
});

Template.home.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
});
