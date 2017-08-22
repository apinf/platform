/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Collection imports
import OrganizationCover from '/apinf_packages/organizations/cover/collection/collection';

Meteor.publish('organizationCoverById', (coverId) => {
  check(coverId, String);
  // Convert to Mongo ObjectID
  const objectId = new Mongo.Collection.ObjectID(coverId);

  return OrganizationCover.find({
    _id: objectId,
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
