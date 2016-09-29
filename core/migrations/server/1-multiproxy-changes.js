import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

Migrations.add({
  version: 1,
  name: 'Move proxy settings to Proxies collection',
  up () {
    Meteor.call('migrateProxySettings');
  },
});

Migrations.add({
  version: 2,
  name: 'Migrate all apiBackends to new structure',
  up () {
    Meteor.call('migrateApiBackends');
  },
});
