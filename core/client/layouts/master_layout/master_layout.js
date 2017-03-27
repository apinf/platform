/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Branding from '/branding/collection';

Template.masterLayout.onCreated(function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscribe to project logo
  this.subscribe('projectLogo');
});

Template.masterLayout.helpers({
  branding () {
    // Return Branding document, or undefined
    return Branding.findOne();
  },
});
