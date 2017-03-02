// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
