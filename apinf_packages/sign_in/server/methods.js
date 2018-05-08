/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  userVerification (userEmail) {
    check(userEmail, String);
    // check user exists or not
    const userData = Meteor.users.findOne({ 'emails.0.address': userEmail });

    // check user exists or not by username
    if (!userData) {
      return {
        status: 'failed',
        message: 'User not found.',
      };
    }
    // check user already verified or not
    if (userData.emails[0].verified) {
      return {
        status: 'failed',
        message: 'Already verified.',
      };
    }
    let message = 'A new email has been sent to you.';
    message += " If the email doesn't show up in your inbox, be sure to check your spam folderx.";
    Accounts.sendEnrollmentEmail(userData._id);
    return {
      status: 'success',
      message,
    };
  },
});
