/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
  Meteor.methods({
    userCreate (userData) {
      check(userData, Object);
      const userId = Accounts.createUser(userData);
      Meteor.users.update(userId, {
        $set: {
          'emails.0.verified': true,
        },
      });
      return Meteor.users.findOne(userId);
    },
  });
}
