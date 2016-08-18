import { Proxies } from './';

Proxies.allow({
  insert: function () {

    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  update: function () {

    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove: function () {

    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  }
});
