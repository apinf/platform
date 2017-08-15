/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import ApiBackendRatings from './';

ApiBackendRatings.allow({
  insert (userId) {
    // User must be logged in to vote
    return !!(userId);
  },
  update (userId, rating) {
    return (userId === rating.userId);
  },
});
