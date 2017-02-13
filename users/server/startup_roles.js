import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
  // Make sure 'manager' role is defined

  // Get all roles
  const roles = Roles.getAllRoles().fetch();

  // Create an array of role names
  const roleNames = _.map(roles, (role) => { return role.name; });

  // Check if 'manager' role is defined
  const managerRoleIsDefined = _.includes(roleNames, 'manager');

  // If manager role is not defined
  if (!managerRoleIsDefined) {
    // Create the 'manager' role
    Roles.createRole('manager');
  }
});
