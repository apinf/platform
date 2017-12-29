/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import apiDocs from '/apinf_packages/api_docs/collection';

Migrations.add({
  version: 11,
  name: 'Fix api documents migration: change type File to Url',
  up () {
    // If documentation is uploaded as remote file but type is file
    // Also make sure that file isn't uploaded as file (fileId doesn't exist)
    apiDocs.update(
      { remoteFileUrl: { $exists: true }, type: 'file', fileId: { $exists: false } },
      { $set: { type: 'url' } }
      );
  },
});
