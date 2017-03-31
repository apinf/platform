/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.viewApiLogo.onCreated(function () {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');
});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink () {
    // Get API current API Backend from template data
    const api = Template.currentData().api;

    // Return undefined or API logo file URL
    return api.logoUrl();
  },
  apiLogoExists () {
    // Get API current API Backend from template data
    const api = Template.currentData().api;
    // Return boolean logo exist
    return !!api.logo();
  },
});
