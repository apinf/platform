/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Migrations } from 'meteor/percolate:migrations';

import Organizations from '/organizations/collection/';

Migrations.add({
  version: 7,
  name: 'Ensure all Organizations have featuredApiIds array',
  up () {
    // Code to migrate up to version 8

    //  Migrate to add 'featuredApiIds' in Organization documents
    //  to contain a list of featured APIs.
    Organizations.find({ featuredApiIds: { $exists: false } }).forEach((organization) => {
      // Create featuredApiIds field and set the value to empty array
      Organizations.update(organization._id, {
        $set: { featuredApiIds: [] },
      });
    });
  },
});
