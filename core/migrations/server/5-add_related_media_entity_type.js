/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Migrations } from 'meteor/percolate:migrations';

import Posts from '/packages/related_media/collection';

Migrations.add({
  version: 5,
  name: 'Adds entityType to indicate where media document is attached to',
  up () {
    // Code to migrate up to version 5

    //  Migrate to add 'entityType' in related media documents
    //  to indicate, where they are attached to.
    //  Presumption: all existing related media documents are attached to APIs.
    Posts.find().forEach((post) => {
      // Create entityType field and set the value
      Posts.update(post._id, {
        $set: { entityType: 'api', entityId: post.apiId },
      });
    });
  },
});
