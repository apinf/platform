/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Feedback from './';

Feedback.allow({
  insert (userId) {
    // Allow only registered users to send feedback
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
  update (userId, feedback) {
    // Check if user is allowed to edit feedback
    return (feedback && feedback.currentUserCanEdit());
  },
  remove (userId, feedback) {
    // Check if user is allowed to edit feedback
    return (feedback && feedback.currentUserCanEdit());
  },
});
