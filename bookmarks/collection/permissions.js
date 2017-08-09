/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import ApiBookmarks from './';

ApiBookmarks.allow({
  insert (userId) {
    // Allow only registered users to send bookmarks
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
  update (userId) {
    // Allow only registered users to update bookmarks
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
});
