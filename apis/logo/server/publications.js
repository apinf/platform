/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Collection imports
import ApiLogo from '../collection';

Meteor.publish('currentApiLogo', (apiLogoFileId) => {
  check(apiLogoFileId, String);
  // Convert to Mongo ObjectID
  const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

  return ApiLogo.find({
    _id: objectId,
    'metadata._Resumable': { $exists: false },
  });
});

Meteor.publish('apiLogoByIds', (apiLogoIds) => {
  check(apiLogoIds, Array);

  const objectIds = apiLogoIds.map((apiLogoId) => {
    // Convert to Mongo ObjectID
    return new Mongo.Collection.ObjectID(apiLogoId);
  });

  return ApiLogo.find({
    _id: { $in: objectIds },
    'metadata._Resumable': { $exists: false },
  });
});
