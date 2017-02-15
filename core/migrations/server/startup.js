// Meteor packages imports
import { Migrations } from 'meteor/percolate:migrations';

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
