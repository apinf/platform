/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import apiDocs from '/apinf_packages/api_docs/collection';

Migrations.add({
  version: 14,
  name: 'Fix api documents migration: change type String to Array of otherUrl',
  up () {
    // If otherUrl exist in in apiDocs
    apiDocs.find({ otherUrl: { $exists: true } }).forEach((doc) => {
      // Update apiDocs
      if (doc && doc.otherUrl && typeof doc.otherUrl === 'string') {
        apiDocs.update(doc._id, {
          $set: { otherUrl: [doc.otherUrl] },
        });
      }
    });
  },
});
