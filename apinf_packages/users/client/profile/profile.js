/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.profile.helpers({
  currentUser () {
    return Meteor.user();
  },
  usersCollection () {
    // Return reference to Meteor.users collection
    return Meteor.users;
  },
  userEmail () {
    let email;
    // Get current user
    const user = Meteor.user();

    // Make sure user exists
    if (user) {
      // Get e-mail address
      email = user.emails[0].address;
    }

    return email;
  },
});
