/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiBookmarks from '/imports/bookmarks/collection';

Meteor.publish('userApiBookmarks', function () {
  // Get current user id
  const userId = this.userId;

  if (userId) {
    // Returning user bookmarks object
    return ApiBookmarks.find({ userId });
  }

  return [];
});
