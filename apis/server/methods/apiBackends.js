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
  apiExists (slug) {
    // Make sure apiId is a string
    check(slug, String);

    // Look for API
    const api = Apis.findOne({ slug });

    // Return true if API exists, false if undefined
    return (api);
  },
});
