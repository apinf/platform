/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Migrations.add({
  version: 15,
  name: 'Adds the slug field for APIs document if it has not been created yet',
  up () {
    // Iterate through apis collection
    Apis.find({ slug: { $exists: false } }).forEach((api) => {
      if (api.name) {
        Meteor.call('updateApiBySlug', { name: api.name });
      }
    });
  },
});
