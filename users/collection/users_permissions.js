/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

Meteor.users.allow({
  update (currentUserId, user) {
    // Only allow user to update own username
    return (currentUserId === user._id);
  },
});
