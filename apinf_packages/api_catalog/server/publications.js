/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiBackendRatings from '/apinf_packages/ratings/collection';
import ApiBookmarks from '/apinf_packages/bookmarks/collection';

Meteor.publish('catalogRatings', () => {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogBookmarks', () => {
  // Find all API Backends
  return ApiBookmarks.find();
});
