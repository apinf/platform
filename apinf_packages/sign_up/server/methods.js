/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { Accounts } from 'meteor/accounts-base';

// Collection imports


Meteor.methods({
  'user.register' (user) {
    check(user, Object);
    // check user already exists or not
    const userData = Meteor.users.findOne({ $or: [ { 'username': user.username }, { 'emails.0.address': user.email } ] });

    // check user exists or not by username
    if (userData && userData.username == user.username)
      return { "status": "failed", "message": "Username already exists." };

    // check user exists or not by user email
    if (userData && userData.emails[0].address == user.email)
      return { "status": "failed", "message": "Email already exists." };

    // create user
    const userId = Accounts.createUser(user);

    // check user is created or not
    if (!userId)
      return { "status": "failed", "message": "User not created" };

    return { "status": "success", "message": "We have sent you an email. Please verify your email address." };;
  }
});
