/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apis/collection';

Meteor.publish('allUsersUsernamesOnly', () => {
  return Meteor.users.find({}, { fields: { username: 1 } });
});

// TODO: determine whether this publication is used
// If it is used, refactor it to be a regular publication
Meteor.publishComposite('user', () => {
  return {
    find () {
      return Meteor.users.find({
        _id: this.userId,
      });
    },
  };
});

Meteor.publish('apiAuthorizedUsersPublicDetails', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  // Get API document
  const api = Apis.findOne(apiId);

  // Return all authorized user documents
  return Meteor.users.find({ _id: { $in: api.authorizedUserIds } },
    { fields: { username: 1, emails: 1, _id: 1 } }
  );
});
