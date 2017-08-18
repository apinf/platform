/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apis/collection';

Meteor.methods({
  getApi (slug) {
    // Make sure slug is a string
    check(slug, String);

    // Look for API
    const api = Apis.findOne({ slug });

    // Make sure API item exists
    if (api) {
      // Attach logo url
      api.logoUrl = api.logoUrl();
    }

    // Return the API
    return api;
  },
});
