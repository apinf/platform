import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';

Migrations.add({
  version: 5,
  name: 'Adds the slug field for APIs document if it has not been created yet',
  up () {
    // Code to migrate up to version 4

    Apis.find({ slug: { $exists: false } }).forEach((api) => {
      Apis.update(api._id);
    });
  },
});
