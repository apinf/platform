import { Proxies } from './';

Proxies.allow({
  insert () {
    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  update () {
    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
  remove () {
    // Check if user has admin role
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  },
});
