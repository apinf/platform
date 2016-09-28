import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
