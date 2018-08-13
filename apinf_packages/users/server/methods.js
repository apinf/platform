/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ValidEmail } from 'meteor/froatsnook:valid-email';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

Meteor.methods({
  deleteAccount (userId) {
    // Make sure userId is a String
    check(userId, String);

    let user;
    if (this.userId === userId) {
      // Remove user from all Organizations
      Meteor.call('removeUserFromAllOrganizations', userId);

      user = Meteor.users.remove({
        _id: this.userId,
      });
    }
    return user;
  },
  checkIfEmailIsRegistered (email) {
    // Make sure email is a valid email
    check(email, ValidEmail);

    // Get any user with matching email
    const user = Accounts.findUserByEmail(email);

    // placeholder for return value
    let emailIsRegistered;

    // If user is found, then email is registered
    if (user) {
      emailIsRegistered = true;
    } else {
      emailIsRegistered = false;
    }

    return emailIsRegistered;
  },
  sendRegistrationEmailVerification (userId) {
    // Make sure userId is a String
    check(userId, String);

    // Get settings
    const settings = Settings.findOne();

    // Check mail settings have been enabled
    if (settings && settings.mail && settings.mail.enabled) {
      Accounts.sendVerificationEmail(userId);
    }
  },
  userIsAdmin () {
    const userId = this.userId;

    return Roles.userIsInRole(userId, ['admin']);
  },
  '_accounts/unlink/service': function (userId, serviceName) {
    Accounts.unlinkService(userId, serviceName);
  }
});
